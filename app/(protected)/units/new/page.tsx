import { UnitForm } from "@/components/ui/forms/unit-form";
import { getCustomersForSelect } from "@/server/queries/unit-queries";
import { requireMasterDataAccess } from "@/lib/auth-guards";


export default async function NewUnitPage() {
  await requireMasterDataAccess();
  
  const customers = await getCustomersForSelect();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Nova unidade
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Cadastre um novo local de atendimento.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <UnitForm customers={customers} />
      </div>
    </div>
  );
}