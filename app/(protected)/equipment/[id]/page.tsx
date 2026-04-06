import Link from "next/link";
import { notFound } from "next/navigation";
import { getEquipmentById } from "@/server/queries/equipment-queries";
import { requireMasterDataAccess } from "@/lib/auth-guards";
import { QRCodeGenerator } from "@/components/ui/equipment/qr-code-generator";
import { EquipmentDetailsCard } from "@/components/ui/equipment/equipment-details-card";
import { VisitsHistoryCard } from "@/components/ui/shared/visits-history-card";

type EquipmentDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EquipmentDetailPage({
  params,
}: EquipmentDetailPageProps) {
  
  await requireMasterDataAccess();
  const { id } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    notFound();
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {equipment.equipmentType}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {equipment.customer.tradeName || equipment.customer.legalName} •{" "}
            {equipment.unit.name}
          </p>
        </div>

        <Link
          href={`/equipment/${equipment.id}/edit`}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Editar
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <EquipmentDetailsCard equipment={equipment} />

        <div className="space-y-6">
          <QRCodeGenerator 
            equipmentId={equipment.id} 
            equipmentName={`${equipment.equipmentType} ${equipment.brand ? `(${equipment.brand})` : ""}`} 
          />

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Resumo</h2>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Últimas visitas</span>
                <strong className="text-slate-900">{equipment.visits.length}</strong>
              </div>
            </div>
          </div>

          <VisitsHistoryCard visits={equipment.visits} />
        </div>
      </div>
    </div>
  );
}