import Link from "next/link";
import { RecentVisitsCard } from "@/components/ui/dashboard/recent-visits-card";
import { NextVisitsCard } from "@/components/ui/dashboard/next-visits-card";
import { LifeBuoy, ClockAlert, Wrench, ShieldCheck } from "lucide-react";
import { StatsCard } from "@/components/ui/dashboard/stats-cards";

interface CustomerDashboardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export function CustomerDashboard({ data }: CustomerDashboardProps) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-3 lg:col-span-1 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-lg shadow-primary/20 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold font-heading mb-2">Precisa de Ajuda?</h2>
            <p className="text-primary-foreground/80 text-sm mb-6 max-w-[250px]">
              Sua máquina parou ou apresenta defeito? Abra um chamado técnico agora mesmo.
            </p>
            <Link 
              href="/tickets/new"
              className="inline-flex items-center gap-2 bg-white text-primary px-5 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              <LifeBuoy className="w-5 h-5" />
              Abrir Chamado
            </Link>
          </div>
          <ShieldCheck className="absolute -bottom-6 -right-6 w-32 h-32 text-white opacity-10" />
        </div>

        <div className="md:col-span-3 lg:col-span-2 grid gap-4 sm:grid-cols-2">
          <StatsCard
            title="Meus Equipamentos"
            value={data.totalActiveEquipment ?? 0}
            description="Equipamentos em sua unidade"
            icon={<Wrench className="h-5 w-5" />}
          />
          <StatsCard
            title="Chamados em Aberto"
            value={(data.visitsByStatus?.REQUESTED || 0) + (data.visitsByStatus?.SCHEDULED || 0) + (data.visitsByStatus?.IN_PROGRESS || 0)}
            description="Visitas pendentes de resolução"
            icon={<ClockAlert className="h-5 w-5" />}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentVisitsCard visits={data.recentVisits} />
        <NextVisitsCard visits={data.nextVisits} />
      </section>
    </>
  );
}
