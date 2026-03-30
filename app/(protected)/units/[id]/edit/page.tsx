import { notFound } from "next/navigation";
import { UnitForm } from "@/components/ui/forms/unit-form";
import { getCustomersForSelect, getUnitById } from "@/server/queries/unit-queries";
import { requireMasterDataAccess } from "@/lib/auth-guards";


type EditUnitPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUnitPage({ params }: EditUnitPageProps) {
  await requireMasterDataAccess();
  
  const { id } = await params;
  const unit = await getUnitById(id);
  const customers = await getCustomersForSelect();

  if (!unit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Editar unidade
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Atualize os dados da unidade.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <UnitForm unit={unit} customers={customers} />
      </div>
    </div>
  );
}