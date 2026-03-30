import Link from "next/link";
import { getUnits } from "@/server/queries/unit-queries";
import { UnitsTable } from "@/components/ui/tables/units-table";
import { requireMasterDataAccess } from "@/lib/auth-guards";


export default async function UnitsPage() {
  await requireMasterDataAccess();
  
  const units = await getUnits();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
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

      <UnitsTable units={units} />
    </div>
  );
}