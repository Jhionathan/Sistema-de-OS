import Link from "next/link";
import { getCustomers } from "@/server/queries/customer-queries";
import { CustomersTable } from "@/components/ui/tables/customers-table";
import { CustomersFilters } from "@/components/ui/customers/customers-filters";
import { Pagination } from "@/components/ui/shared/pagination";
import { requireMasterDataAccess } from "@/lib/auth-guards";

interface CustomersPageProps {
  searchParams: Promise<{
    query?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  await requireMasterDataAccess();
  const params = await searchParams;

  const query = params.query || "";
  const status = params.status || "";
  const page = Number(params.page) || 1;
  const pageSize = 15;

  const { customers, total } = await getCustomers({ search: query, status, page, pageSize });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Clientes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie os clientes cadastrados no sistema.
          </p>
        </div>

        <Link
          href="/customers/new"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Novo cliente
        </Link>
      </div>

      <CustomersFilters />

      <div className="space-y-4">
        <CustomersTable customers={customers} />
        <Pagination totalItems={total} pageSize={pageSize} currentPage={page} />
      </div>
    </div>
  );
}
