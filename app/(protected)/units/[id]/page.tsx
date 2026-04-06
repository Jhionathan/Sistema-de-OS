import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnitById } from "@/server/queries/unit-queries";
import { requireMasterDataAccess } from "@/lib/auth-guards";
import { UnitDetailsCard } from "@/components/ui/units/unit-details-card";
import { VisitsHistoryCard } from "@/components/ui/shared/visits-history-card";

type UnitDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  await requireMasterDataAccess();
  
  const { id } = await params;
  const unit = await getUnitById(id);

  if (!unit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {unit.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {unit.customer.tradeName || unit.customer.legalName}
          </p>
        </div>

        <Link
          href={`/units/${unit.id}/edit`}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Editar
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <UnitDetailsCard unit={unit} />

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Resumo</h2>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Equipamentos</span>
                <strong className="text-slate-900">{unit.equipment.length}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span>Últimas visitas</span>
                <strong className="text-slate-900">{unit.visits.length}</strong>
              </div>
            </div>
          </div>

          <VisitsHistoryCard visits={unit.visits} />
        </div>
      </div>
    </div>
  );
}