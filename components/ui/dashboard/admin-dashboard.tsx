import { StatsCard } from "@/components/ui/dashboard/stats-cards";
import { RecentVisitsCard } from "@/components/ui/dashboard/recent-visits-card";
import { NextVisitsCard } from "@/components/ui/dashboard/next-visits-card";
import { OperationalAlertsCard } from "@/components/ui/dashboard/operational-alerts-card";
import { VisitsStatusCard } from "@/components/ui/dashboard/visits-status-card";
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

interface AdminDashboardProps {
  data: any;
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  return (
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
  );
}
