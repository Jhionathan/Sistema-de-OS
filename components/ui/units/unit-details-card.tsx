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

interface UnitDetailsCardProps {
  unit: any;
}

export function UnitDetailsCard({ unit }: UnitDetailsCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Dados da unidade
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Info label="Cliente" value={unit.customer.tradeName || unit.customer.legalName} />
        <Info label="Responsável" value={unit.contactName} />
        <Info label="Telefone" value={unit.contactPhone} />
        <Info label="Rua" value={unit.street} />
        <Info label="Número" value={unit.number} />
        <Info label="Bairro" value={unit.district} />
        <Info label="Cidade" value={unit.city} />
        <Info label="Estado" value={unit.state} />
        <Info label="CEP" value={unit.zipCode} />
        <Info label="Status" value={unit.isActive ? "Ativa" : "Inativa"} />
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-700">Observações</p>
        <p className="mt-2 text-sm text-slate-600">
          {unit.notes || "Nenhuma observação cadastrada."}
        </p>
      </div>
    </div>
  );
}
