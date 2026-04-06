import { StatsCard } from "@/components/ui/dashboard/stats-cards";
import { RecentVisitsCard } from "@/components/ui/dashboard/recent-visits-card";
import { NextVisitsCard } from "@/components/ui/dashboard/next-visits-card";
import { OperationalAlertsCard } from "@/components/ui/dashboard/operational-alerts-card";
import { VisitsStatusCard } from "@/components/ui/dashboard/visits-status-card";
import { 
  CalendarCheck, 
  RotateCcw, 
  ClockAlert, 
  CheckCircle2
} from "lucide-react";

interface TechnicianDashboardProps {
  data: any;
}

export function TechnicianDashboard({ data }: TechnicianDashboardProps) {
  return (
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
  );
}
