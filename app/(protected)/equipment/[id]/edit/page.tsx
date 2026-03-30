import { notFound } from "next/navigation";
import { EquipmentForm } from "@/components/ui/forms/equipment-form";
import {
  getCustomersForEquipmentSelect,
  getEquipmentById,
  getUnitsForEquipmentSelect,
} from "@/server/queries/equipment-queries";

type EditEquipmentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditEquipmentPage({
  params,
}: EditEquipmentPageProps) {
  const { id } = await params;

  const [equipment, customers, units] = await Promise.all([
    getEquipmentById(id),
    getCustomersForEquipmentSelect(),
    getUnitsForEquipmentSelect(),
  ]);

  if (!equipment) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Editar equipamento
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Atualize os dados do equipamento.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <EquipmentForm
          equipment={equipment}
          customers={customers}
          units={units}
        />
      </div>
    </div>
  );
}