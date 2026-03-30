import Link from "next/link";
import {
  getCustomersForVisitFilter,
  getTechniciansForVisitSelect,
  getVisits,
} from "@/server/queries/visit-queries";
import { VisitsTable } from "@/components/ui/tables/visits-table";
import { VisitsFilters } from "@/components/ui/forms/visits-filters";

type VisitsPageProps = {
  searchParams: Promise<{
    status?: string;
    visitType?: string;
    technicianId?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
};

export default async function VisitsPage({ searchParams }: VisitsPageProps) {
  const filters = await searchParams;

  const [visits, technicians, customers] = await Promise.all([
    getVisits(filters),
    getTechniciansForVisitSelect(),
    getCustomersForVisitFilter(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Visitas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie os atendimentos técnicos do sistema.
          </p>
        </div>

        <Link
          href="/visits/new"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Nova visita
        </Link>
      </div>

      <VisitsFilters technicians={technicians} customers={customers} />

      <VisitsTable visits={visits} />
    </div>
  );
}