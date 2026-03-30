import { auth } from "@/lib/auth";
import { StatsCard } from "@/components/ui/dashboard/stats-cards";
import { RecentVisitsCard } from "@/components/ui/dashboard/recent-visits-card";
import { NextVisitsCard } from "@/components/ui/dashboard/next-visits-card";
import { OperationalAlertsCard } from "@/components/ui/dashboard/operational-alerts-card";
import { VisitsStatusCard } from "@/components/ui/dashboard/visits-status-card";
import { getDashboardStats } from "@/server/queries/dashboard-queries";

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardStats();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Olá, {session?.user?.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Aqui está o panorama operacional do sistema.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Clientes ativos"
          value={data.totalCustomers}
          description="Clientes cadastrados e ativos"
        />
        <StatsCard
          title="Equipamentos ativos"
          value={data.totalActiveEquipment}
          description="Ativos em operação"
        />
        <StatsCard
          title="Visitas hoje"
          value={data.visitsToday}
          description="Atendimentos previstos hoje"
        />
        <StatsCard
          title="Pendentes de retorno"
          value={data.pendingReturns}
          description="Necessitam nova ação técnica"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Visitas atrasadas"
          value={data.overdueVisits}
          description="Agendadas e ainda não resolvidas"
        />
        <StatsCard
          title="Em manutenção"
          value={data.equipmentInMaintenance}
          description="Equipamentos fora da operação normal"
        />
        <StatsCard
          title="Concluídas no mês"
          value={data.completedThisMonth}
          description="Atendimentos fechados no mês atual"
        />
        <StatsCard
          title="Técnicos ativos"
          value={data.activeTechnicians}
          description="Profissionais disponíveis no sistema"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <VisitsStatusCard visitsByStatus={data.visitsByStatus} />
        <OperationalAlertsCard
          overdueVisits={data.overdueVisits}
          pendingReturns={data.pendingReturns}
          equipmentInMaintenance={data.equipmentInMaintenance}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentVisitsCard visits={data.recentVisits} />
        <NextVisitsCard visits={data.nextVisits} />
      </section>
    </div>
  );
}