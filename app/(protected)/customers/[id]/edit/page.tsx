import { notFound } from "next/navigation";
import { getCustomerById } from "@/server/queries/customer-queries";
import { CustomerForm } from "@/components/ui/forms/customer-form";

type EditCustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Editar cliente
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Atualize as informações do cliente.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <CustomerForm customer={customer} />
      </div>
    </div>
  );
}