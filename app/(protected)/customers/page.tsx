import Link from "next/link";
import { getCustomers } from "@/server/queries/customer-queries";
import { CustomersTable } from "@/components/ui/tables/customers-table";
import { requireMasterDataAccess } from "@/lib/auth-guards";

export default async function CustomersPage() {
  await requireMasterDataAccess();
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
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

      <CustomersTable customers={customers} />
    </div>
  );
}