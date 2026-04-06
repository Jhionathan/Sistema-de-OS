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

interface TechnicianDetailsCardProps {
  technician: any;
}

export function TechnicianDetailsCard({ technician }: TechnicianDetailsCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Dados do técnico
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Info label="Nome" value={technician.name} />
        <Info label="E-mail" value={technician.email} />
        <Info label="Telefone" value={technician.phone} />
        <Info label="Status" value={technician.isActive ? "Ativo" : "Inativo"} />
        <Info label="Usuário vinculado" value={technician.user?.email ?? null} />
        <Info label="Perfil do usuário" value={technician.user?.role ?? null} />
      </div>
    </div>
  );
}
