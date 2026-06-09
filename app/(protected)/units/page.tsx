import Link from "next/link";
import { getUnits } from "@/server/queries/unit-queries";
import { UnitsTable } from "@/components/ui/tables/units-table";
import { UnitsFilters } from "@/components/ui/units/units-filters";
import { Pagination } from "@/components/ui/shared/pagination";
import { requireMasterDataAccess } from "@/lib/auth-guards";

interface UnitsPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function UnitsPage({ searchParams }: UnitsPageProps) {
  await requireMasterDataAccess();
  const params = await searchParams;

  const query = params.query || "";
  const page = Number(params.page) || 1;
  const pageSize = 15;

  const { units, total } = await getUnits({ search: query, page, pageSize });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Unidades
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie os locais de atendimento dos clientes.
          </p>
        </div>

        <Link
          href="/units/new"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Nova unidade
        </Link>
      </div>

      <UnitsFilters />

      <div className="space-y-4">
        <UnitsTable units={units} />
        <Pagination totalItems={total} pageSize={pageSize} currentPage={page} />
      </div>
    </div>
  );
}
