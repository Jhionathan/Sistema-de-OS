import { EquipmentForm } from "@/components/ui/forms/equipment-form";
import {
  getCustomersForEquipmentSelect,
  getUnitsForEquipmentSelect,
} from "@/server/queries/equipment-queries";

export default async function NewEquipmentPage() {
  const [customers, units] = await Promise.all([
    getCustomersForEquipmentSelect(),
    getUnitsForEquipmentSelect(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Novo equipamento
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Cadastre um novo equipamento em comodato.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <EquipmentForm customers={customers} units={units} />
      </div>
    </div>
  );
}