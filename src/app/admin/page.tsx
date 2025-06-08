import { Users, DollarSign, CreditCard, CheckCircle } from "lucide-react";
import { StatsCard } from "./_components/StatsCard";
import { SalesChart } from "./_components/SalesChart";

// Importe suas funções de busca de dados
import {
  getTotalStudents,
  getPendingPayments,
  getCompletedStudents,
  getSalesData,
} from "@/lib/data"; // Adapte o caminho

export default async function DashboardPage() {
  // Buscando os dados necessários
  const [totalStudents, pendingPayments, completedStudents, salesData] =
    await Promise.all([
      getTotalStudents(),
      getPendingPayments(),
      getCompletedStudents(),
      getSalesData(),
    ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Grid de Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Alunos"
          value={totalStudents}
          icon={Users}
          description="Todos os alunos cadastrados na plataforma."
        />
        <StatsCard
          title="Pagamentos Pendentes"
          value={pendingPayments}
          icon={CreditCard}
          description="Alunos com faturas em aberto."
        />
        <StatsCard
          title="Cursos Concluídos"
          value={completedStudents}
          icon={CheckCircle}
          description="Alunos que finalizaram todos os módulos."
        />
        <StatsCard
          title="Vendas (Mês)"
          // Exemplo de como pegar um valor do dataset de vendas
          value={`R$ ${salesData.monthly.reduce(
            (sum, item) => sum + item.Vendas,
            0
          )}`}
          icon={DollarSign}
          description="Total de vendas no mês corrente."
        />
      </div>

      {/* Gráfico de Vendas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SalesChart data={salesData} />
      </div>
    </div>
  );
}
