interface InfoProps {
  label: string;
  value: string | null;
}

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <p className="mt-1 text-sm text-slate-600">{value || "-"}</p>
    </div>
  );
}

interface CustomerDetailsCardProps {
  customer: any;
}

export function CustomerDetailsCard({ customer }: CustomerDetailsCardProps) {
  return (
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
  );
}
