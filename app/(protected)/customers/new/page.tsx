import { CustomerForm } from "@/components/ui/forms/customer-form";
import { requireMasterDataAccess } from "@/lib/auth-guards";


export default async function NewCustomerPage() {
  await requireMasterDataAccess();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Novo cliente
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Preencha os dados para cadastrar um cliente.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <CustomerForm />
      </div>
    </div>
  );
}