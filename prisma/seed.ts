// prisma/seed.ts

import {
  PrismaClient,
  Role,
  PaymentStatus,
  EnrollmentStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

// Inicializa o Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando o processo de seed...");

  // --- 1. LIMPEZA DO BANCO DE DADOS (em ordem reversa de dependência) ---
  console.log("🧹 Limpando dados existentes...");
  await prisma.payment.deleteMany({});
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.courseEnrollment.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("✅ Dados limpos.");

  // --- 2. CRIAÇÃO DE USUÁRIOS ---
  console.log("👤 Criando usuários...");
  const hashedPassword = await bcrypt.hash("senha123", 10);

  // Criar um Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin Master",
      password: hashedPassword,
      role: Role.ADMIN,
      image: "/images/default-profile.jpg", // Imagem padrão para o admin
    },
  });

  const students = []; // Usaremos um array para guardar os alunos criados
  for (let i = 0; i < 20; i++) {
    const student = await prisma.user.create({
      data: {
        email: `student${i + 1}@example.com`,
        name: `Aluno ${i + 1}`,
        password: hashedPassword,
        role: Role.USER,
        image: "/images/default-profile.jpg",
      },
    });
    students.push(student);
    // Log a cada criação para ver o progresso
    console.log(` -> Criado: ${student.name}`);
  }
  console.log(`✅ ${students.length} usuários Aluno criados em ordem.`);

  // --- 3. CRIAÇÃO DE CURSOS ---
  console.log("📚 Criando cursos...");
  const coursesData = [
    { title: "Next.js do Zero ao Avançado", price: 299.9 },
    { title: "Dominando Tailwind CSS", price: 149.5 },
    { title: "Prisma e Bancos de Dados para Web", price: 189.0 },
    { title: "Autenticação Completa com NextAuth.js", price: 210.0 },
  ];

  // Usaremos este array para guardar os cursos criados em ordem
  const createdCourses = [];

  console.log("➕ Criando cursos em sequência...");
  for (const courseData of coursesData) {
    const course = await prisma.course.create({
      data: {
        ...courseData,
        description: `Descrição completa para o curso ${courseData.title}.`,
        isPublished: true,
        creatorId: admin.id, // 'admin' deve ter sido criado antes
      },
    });
    createdCourses.push(course);
    console.log(` -> Criado curso: ${course.title}`);
  }

  // Ao final do loop, use o novo array 'createdCourses' se precisar da lista
  console.log(`✅ ${createdCourses.length} cursos criados em ordem.`);

  // --- 4. SIMULAÇÃO DE VENDAS, PAGAMENTOS E MATRÍCULAS ---
  console.log("🛒 Simulando vendas e matrículas...");
  let salesCount = 0;
  for (const student of students) {
    // Cada aluno comprará de 1 a 3 cursos aleatórios
    const coursesToBuy = createdCourses
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    if (coursesToBuy.length === 0) continue;

    const totalAmount = coursesToBuy.reduce(
      (sum, course) => sum + course.price.toNumber(),
      0
    );

    // Criar a Venda
    const sale = await prisma.sale.create({
      data: {
        userId: student.id,
        totalAmount,
        items: {
          create: coursesToBuy.map((course) => ({
            courseId: course.id,
            priceAtTimeOfSale: course.price,
          })),
        },
      },
    });
    salesCount++;

    // Criar o Pagamento para a Venda
    // 80% de chance de estar PAGO, 20% PENDENTE
    const paymentStatus =
      Math.random() < 0.8 ? PaymentStatus.PAID : PaymentStatus.PENDING;
    await prisma.payment.create({
      data: {
        saleId: sale.id,
        userId: student.id,
        amount: totalAmount,
        status: paymentStatus,
      },
    });

    // Criar Matrículas apenas se o pagamento foi efetuado
    if (paymentStatus === PaymentStatus.PAID) {
      for (const course of coursesToBuy) {
        // 50% de chance de já ter completado o curso
        const enrollmentStatus =
          Math.random() < 0.5
            ? EnrollmentStatus.COMPLETED
            : EnrollmentStatus.IN_PROGRESS;
        await prisma.courseEnrollment.create({
          data: {
            userId: student.id,
            courseId: course.id,
            status: enrollmentStatus,
            completedAt:
              enrollmentStatus === EnrollmentStatus.COMPLETED
                ? new Date()
                : null,
          },
        });
      }
    }
  }
  console.log(`✅ ${salesCount} vendas e matrículas simuladas.`);

  console.log("🎉 Seed finalizado com sucesso!");
}

// Executa a função principal e lida com erros
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Garante que a conexão com o banco seja fechada
    await prisma.$disconnect();
  });
