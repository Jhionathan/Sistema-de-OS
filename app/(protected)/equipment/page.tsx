import Link from "next/link";
import { getEquipment } from "@/server/queries/equipment-queries";
import { EquipmentTable } from "@/components/ui/tables/equipament-table";

export default async function EquipmentPage() {
  const equipment = await getEquipment();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Equipamentos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie os equipamentos em comodato.
          </p>
        </div>

        <Link
          href="/equipment/new"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Novo equipamento
        </Link>
      </div>

      <EquipmentTable equipment={equipment} />
    </div>
  );
}