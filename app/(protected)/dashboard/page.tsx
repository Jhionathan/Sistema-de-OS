import { auth } from "@/lib/auth";
import { StatsCard } from "@/components/ui/dashboard/stats-cards";
import { RecentVisitsCard } from "@/components/ui/dashboard/recent-visits-card";
import { NextVisitsCard } from "@/components/ui/dashboard/next-visits-card";
import { OperationalAlertsCard } from "@/components/ui/dashboard/operational-alerts-card";
import { VisitsStatusCard } from "@/components/ui/dashboard/visits-status-card";
import { getDashboardStats } from "@/server/queries/dashboard-queries";
import { 
  CalendarCheck, 
  RotateCcw, 
  ClockAlert, 
  CheckCircle2, 
  Users, 
  Cpu, 
  Wrench, 
  UserCheck 
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardStats(session?.user);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
          Olá, <span className="text-primary">{session?.user?.name}</span>
        </h1>

        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          {data.isTechnician
            ? "Aqui está o resumo das suas visitas e atendimentos operacionais de hoje."
            : "Aqui está o panorama operacional atualizado do seu sistema."}
        </p>
      </section>

      {data.isTechnician ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Visitas hoje"
              value={data.visitsToday}
              description="Atendimentos previstos para hoje"
              icon={<CalendarCheck className="h-5 w-5" />}
            />
            <StatsCard
              title="Pendentes de retorno"
              value={data.pendingReturns}
              description="Visitas que exigem nova ação"
              icon={<RotateCcw className="h-5 w-5" />}
            />
            <StatsCard
              title="Visitas atrasadas"
              value={data.overdueVisits}
              description="Atendimentos em aberto fora do prazo"
              icon={<ClockAlert className="h-5 w-5" />}
            />
            <StatsCard
              title="Concluídas no mês"
              value={data.completedThisMonth}
              description="Visitas finalizadas neste mês"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <VisitsStatusCard visitsByStatus={data.visitsByStatus} />
            <OperationalAlertsCard
              overdueVisits={data.overdueVisits}
              pendingReturns={data.pendingReturns}
              equipmentInMaintenance={0}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <RecentVisitsCard visits={data.recentVisits} />
            <NextVisitsCard visits={data.nextVisits} />
          </section>
        </>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Clientes ativos"
              value={data.totalCustomers}
              description="Clientes cadastrados e ativos"
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Equipamentos ativos"
              value={data.totalActiveEquipment}
              description="Ativos em operação"
              icon={<Cpu className="h-5 w-5" />}
            />
            <StatsCard
              title="Visitas hoje"
              value={data.visitsToday}
              description="Atendimentos previstos hoje"
              icon={<CalendarCheck className="h-5 w-5" />}
            />
            <StatsCard
              title="Pendentes de retorno"
              value={data.pendingReturns}
              description="Necessitam nova ação técnica"
              icon={<RotateCcw className="h-5 w-5" />}
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Visitas atrasadas"
              value={data.overdueVisits}
              description="Agendadas e não resolvidas"
              icon={<ClockAlert className="h-5 w-5" />}
            />
            <StatsCard
              title="Em manutenção"
              value={data.equipmentInMaintenance}
              description="Equipamentos fora de operação"
              icon={<Wrench className="h-5 w-5" />}
            />
            <StatsCard
              title="Concluídas no mês"
              value={data.completedThisMonth}
              description="Atendimentos fechados no mês"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
            <StatsCard
              title="Técnicos ativos"
              value={data.activeTechnicians}
              description="Profissionais disponíveis"
              icon={<UserCheck className="h-5 w-5" />}
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
        </>
      )}
    </div>
  );
}