import Link from "next/link";
import { getVisits } from "@/server/queries/visit-queries";
import { VisitsTable } from "@/components/ui/tables/visits-table";

export default async function VisitsPage() {
  const visits = await getVisits();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Visitas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie os atendimentos técnicos realizados e agendados.
          </p>
        </div>

        <Link
          href="/visits/new"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Nova visita
        </Link>
      </div>

      <VisitsTable visits={visits} />
    </div>
  );
}