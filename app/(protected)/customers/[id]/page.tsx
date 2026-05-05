import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerById } from "@/server/queries/customer-queries";
import { requireMasterDataAccess } from "@/lib/auth-guards";
import { CustomerDetailsCard } from "@/components/ui/customers/customer-details-card";
import { CustomerUnitsList } from "@/components/ui/customers/customer-units-list";
import { CustomerPurchasesList } from "@/components/ui/customers/customer-purchases-list";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }
  
  await requireMasterDataAccess();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {customer.tradeName || customer.legalName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{customer.legalName}</p>
        </div>

        <Link
          href={`/customers/${customer.id}/edit`}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Editar
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <CustomerDetailsCard customer={customer} />

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Resumo
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Unidades</span>
                <strong className="text-slate-900">{customer.units.length}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span>Equipamentos</span>
                <strong className="text-slate-900">{customer.equipment.length}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span>Últimas visitas carregadas</span>
                <strong className="text-slate-900">{customer.visits.length}</strong>
              </div>
            </div>
          </div>

          <CustomerUnitsList units={customer.units} />
          
          <CustomerPurchasesList customerId={customer.id} purchases={customer.purchases} />
        </div>
      </div>
    </div>
  );
}