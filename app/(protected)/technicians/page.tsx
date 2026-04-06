import Link from "next/link";
import { getTechnicians } from "@/server/queries/technician-queries";
import { TechniciansTable } from "@/components/ui/tables/technicians-table";
import { requireMasterDataAccess } from "@/lib/auth-guards";


export default async function TechniciansPage() {
  await requireMasterDataAccess();
  const technicians = await getTechnicians();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Técnicos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie os técnicos responsáveis pelos atendimentos.
          </p>
        </div>

        <Link
          href="/technicians/new"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Novo técnico
        </Link>
      </div>

      <TechniciansTable technicians={technicians} />
    </div>
  );
}