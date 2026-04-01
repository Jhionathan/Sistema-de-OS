import Link from "next/link";
import { getEquipment } from "@/server/queries/equipment-queries";
import { EquipmentTable } from "@/components/ui/tables/equipament-table";
import { requireOperationalAccess } from "@/lib/auth-guards";
import { isCustomer } from "@/lib/permissions";

export default async function EquipmentPage() {
  const session = await requireOperationalAccess();
  
  const equipment = await getEquipment(session.user);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isCustomer(session.user.role) ? "Meus Equipamentos" : "Equipamentos"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isCustomer(session.user.role) ? "Visualize os equipamentos associados à sua conta." : "Gerencie os equipamentos em comodato."}
          </p>
        </div>

        {!isCustomer(session.user.role) && (
          <Link
            href="/equipment/new"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Novo equipamento
          </Link>
        )}
      </div>

      <EquipmentTable equipment={equipment} userRole={session.user.role} />
    </div>
  );
}