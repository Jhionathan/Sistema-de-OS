import Link from "next/link";
import { getEquipment, getCustomersForEquipmentSelect } from "@/server/queries/equipment-queries";
import { EquipmentTable } from "@/components/ui/tables/equipment-table";
import { EquipmentFilters } from "@/components/ui/equipment/equipment-filters";
import { Pagination } from "@/components/ui/shared/pagination";
import { requireOperationalAccess } from "@/lib/auth-guards";
import { isCustomer } from "@/lib/permissions";

interface EquipmentPageProps {
  searchParams: Promise<{
    query?: string;
    customerId?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function EquipmentPage({ searchParams }: EquipmentPageProps) {
  const session = await requireOperationalAccess();
  const params = await searchParams;

  const query = params.query || "";
  const customerId = params.customerId || "";
  const status = params.status || "";
  const page = Number(params.page) || 1;
  const pageSize = 10;

  const [{ equipment, total }, customers] = await Promise.all([
    getEquipment(session.user, {
      search: query,
      customerId,
      status,
      page,
      pageSize,
    }),
    getCustomersForEquipmentSelect(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isCustomer(session.user.role) ? "Meus Equipamentos" : "Equipamentos"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isCustomer(session.user.role)
              ? "Visualize os equipamentos associados à sua conta."
              : "Gerencie os equipamentos em comodato."}
          </p>
        </div>

        {!isCustomer(session.user.role) && (
          <Link
            href="/equipment/new"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Novo equipamento
          </Link>
        )}
      </div>

      <EquipmentFilters customers={customers} userRole={session.user.role} />

      <div className="space-y-4">
        <EquipmentTable equipment={equipment} userRole={session.user.role} />
        
        <Pagination 
          totalItems={total} 
          pageSize={pageSize} 
          currentPage={page} 
        />
      </div>
    </div>
  );
}