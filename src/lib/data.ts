/* eslint-disable @typescript-eslint/no-unused-vars */
// em algum lugar como /lib/data.ts ou diretamente na página

import { prisma } from "@/lib/prisma";
import { Role, PaymentStatus, EnrollmentStatus, Sale } from "@prisma/client";
import {
  subDays,
  startOfWeek,
  startOfMonth,
  format,
  getHours,
  getDay,
  getWeekOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { ptBR } from "date-fns/locale";

// 1. Quantidade de Alunos
export async function getTotalStudents() {
  try {
    const count = await prisma.user.count({
      where: {
        role: Role.USER,
      },
    });
    return count;
  } catch (error) {
    console.error("Erro ao contar alunos:", error);
    throw new Error("Não foi possível obter o total de alunos.");
  }
}

// 2. Alunos com Pagamento Pendente (exige um model 'Payment')
export async function getPendingPayments() {
  // Assumindo que você tem um model Payment com status
  return prisma.payment.count({
    where: { status: PaymentStatus.PENDING },
  });
}

// 3. Alunos que Concluíram (exige um model 'Enrollment')
export async function getCompletedStudents() {
  // Assumindo um model de matrícula com status
  return prisma.courseEnrollment.count({ where: { status: "COMPLETED" } });
}

// 4. Dados de Vendas para o Gráfico (a mais complexa)
export async function getSalesData() {
  const now = new Date();

  // 1. Busca os dados brutos do banco de dados em paralelo
  const [dailySales, weeklySales, fortnightlySales, monthlySales] =
    await Promise.all([
      prisma.sale.findMany({ where: { createdAt: { gte: subDays(now, 1) } } }),
      prisma.sale.findMany({ where: { createdAt: { gte: startOfWeek(now) } } }),
      prisma.sale.findMany({ where: { createdAt: { gte: subDays(now, 15) } } }),
      prisma.sale.findMany({
        where: { createdAt: { gte: startOfMonth(now) } },
      }),
    ]);

  // 2. Processamento dos Dados

  // Processamento Diário: Agrupa vendas por hora (intervalos de 6 horas)
  const daily = Array.from({ length: 4 }, (_, i) => ({
    name: `${String(i * 6).padStart(2, "0")}:00`,
    Vendas: 0,
  }));
  dailySales.forEach((sale) => {
    const hourGroup = Math.floor(getHours(sale.createdAt) / 6);
    daily[hourGroup].Vendas += sale.totalAmount.toNumber();
  });

  // Processamento Semanal: Agrupa vendas por dia da semana
  const weekly = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
    (day) => ({
      name: day,
      Vendas: 0,
    })
  );
  weeklySales.forEach((sale) => {
    const dayIndex = getDay(sale.createdAt); // 0 = Dom, 1 = Seg, ...
    weekly[dayIndex].Vendas += sale.totalAmount.toNumber();
  });

  // Processamento Quinzenal: Agrupa vendas por cada um dos últimos 15 dias
  const last15Days = eachDayOfInterval({ start: subDays(now, 14), end: now });
  const fortnightlyMap = fortnightlySales.reduce((acc, sale) => {
    const day = format(sale.createdAt, "dd/MM");
    acc[day] = (acc[day] || 0) + sale.totalAmount.toNumber();
    return acc;
  }, {} as Record<string, number>);

  const fortnightly = last15Days.map((day) => {
    const formattedDay = format(day, "dd/MM");
    return {
      name: formattedDay,
      Vendas: fortnightlyMap[formattedDay] || 0,
    };
  });

  // Processamento Mensal: Agrupa vendas por semana do mês
  const monthly = Array.from({ length: 5 }, (_, i) => ({
    name: `Sem ${i + 1}`,
    Vendas: 0,
  }));
  monthlySales.forEach((sale) => {
    // getWeekOfMonth retorna a semana (1-5), subtraímos 1 para o índice do array
    const weekIndex = getWeekOfMonth(sale.createdAt, { weekStartsOn: 0 }) - 1;
    if (monthly[weekIndex]) {
      monthly[weekIndex].Vendas += sale.totalAmount.toNumber();
    }
  });

  return { daily, weekly, fortnightly, monthly };
}
