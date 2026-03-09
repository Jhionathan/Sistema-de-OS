import { auth } from "@/lib/auth";
import { StatsCard } from "@/components/ui/dashboard/stats-cards";
import { RecentVisitsCard } from "@/components/ui/dashboard/recent-visits-card";
import { EquipmentOverviewCard } from "@/components/ui/dashboard/equipment-overview-card";
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
          Aqui está um resumo da operação de visitas técnicas.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Clientes ativos"
          value={data.totalCustomers}
          description="Total de clientes cadastrados e ativos"
        />
        <StatsCard
          title="Equipamentos ativos"
          value={data.totalActiveEquipment}
          description="Equipamentos em operação no comodato"
        />
        <StatsCard
          title="Visitas hoje"
          value={data.visitsToday}
          description="Visitas previstas para o dia atual"
        />
        <StatsCard
          title="Pendentes de retorno"
          value={data.pendingReturns}
          description="Visitas que exigem retorno técnico"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <RecentVisitsCard visits={data.recentVisits} />
        <EquipmentOverviewCard items={data.highlightedEquipment} />
      </section>
    </div>
  );
}