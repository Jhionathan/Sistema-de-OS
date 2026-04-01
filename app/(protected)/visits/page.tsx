import Link from "next/link";
import {
  getCustomersForVisitFilter,
  getTechniciansForVisitSelect,
  getVisits,
} from "@/server/queries/visit-queries";
import { VisitsTable } from "@/components/ui/tables/visits-table";
import { VisitsFilters } from "@/components/ui/forms/visits-filters";
import { requireOperationalAccess } from "@/lib/auth-guards";
import { isCustomer } from "@/lib/permissions";

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
  const session = await requireOperationalAccess();
  const filters = await searchParams;

  const [visits, technicians, customers] = await Promise.all([
    getVisits(filters, session.user),
    !isCustomer(session.user.role) ? getTechniciansForVisitSelect() : Promise.resolve([]),
    !isCustomer(session.user.role) ? getCustomersForVisitFilter() : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isCustomer(session.user.role) ? "Minhas Visitas" : "Visitas"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isCustomer(session.user.role) ? "Acompanhe os históricos técnicos em sua empresa." : "Gerencie os atendimentos técnicos do sistema."}
          </p>
        </div>

        {!isCustomer(session.user.role) ? (
          <Link
            href="/visits/new"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            Nova visita
          </Link>
        ) : (
          <Link
            href="/tickets/new"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
          >
            Abrir Chamado
          </Link>
        )}
      </div>

      {!isCustomer(session.user.role) && (
        <VisitsFilters technicians={technicians} customers={customers} />
      )}

      <VisitsTable visits={visits} userRole={session.user.role} />
    </div>
  );
}