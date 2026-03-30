import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerById } from "@/server/queries/customer-queries";
import { requireMasterDataAccess } from "@/lib/auth-guards";

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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {customer.tradeName || customer.legalName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{customer.legalName}</p>
        </div>

        <Link
          href={`/customers/${customer.id}/edit`}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700"
        >
          Editar
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Dados do cliente
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Info label="Razão social" value={customer.legalName} />
            <Info label="Nome fantasia" value={customer.tradeName} />
            <Info label="Documento" value={customer.document} />
            <Info label="E-mail" value={customer.email} />
            <Info label="Telefone" value={customer.phone} />
            <Info
              label="Status"
              value={customer.isActive ? "Ativo" : "Inativo"}
            />
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700">Observações</p>
            <p className="mt-2 text-sm text-slate-600">
              {customer.notes || "Nenhuma observação cadastrada."}
            </p>
          </div>
        </div>

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

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Unidades vinculadas
            </h2>

            <div className="mt-4 space-y-3">
              {customer.units.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Nenhuma unidade cadastrada.
                </p>
              ) : (
                customer.units.map((unit) => (
                  <div key={unit.id} className="rounded-xl border p-3">
                    <p className="font-medium text-slate-900">{unit.name}</p>
                    <p className="text-sm text-slate-500">
                      {unit.city || "-"} / {unit.state || "-"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <p className="mt-1 text-sm text-slate-600">{value || "-"}</p>
    </div>
  );
}