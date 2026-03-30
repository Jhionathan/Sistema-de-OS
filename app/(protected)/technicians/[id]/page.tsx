import Link from "next/link";
import { notFound } from "next/navigation";
import { getTechnicianById } from "@/server/queries/techbician-queries";
import { requireMasterDataAccess } from "@/lib/auth-guards";


type TechnicianDetailPageProps = {
  params: Promise<{ id: string }>;
};

const visitStatusMap: Record<string, string> = {
  SCHEDULED: "Agendada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  CANCELED: "Cancelada",
  PENDING_RETURN: "Pendente retorno",
};

export default async function TechnicianDetailPage({
  params,
}: TechnicianDetailPageProps) {
  const { id } = await params;
  const technician = await getTechnicianById(id);


  if (!technician) {
    notFound();
  }
  await requireMasterDataAccess();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {technician.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {technician.email || "Sem e-mail cadastrado"}
          </p>
        </div>

        <Link
          href={`/technicians/${technician.id}/edit`}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700"
        >
          Editar
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
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

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Resumo</h2>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Últimas visitas carregadas</span>
              <strong className="text-slate-900">
                {technician.visits.length}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          Últimas visitas
        </h2>

        <div className="mt-4 space-y-3">
          {technician.visits.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhuma visita encontrada para este técnico.
            </p>
          ) : (
            technician.visits.map((visit) => (
              <div key={visit.id} className="rounded-xl border p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      {visit.customer.tradeName || visit.customer.legalName}
                    </p>
                    <p className="text-sm text-slate-600">
                      {visit.unit.name} • {visit.equipment.equipmentType}
                    </p>
                  </div>

                  <div className="text-sm text-slate-500">
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(visit.scheduledAt))}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                    {visitStatusMap[visit.status] ?? visit.status}
                  </span>
                </div>
              </div>
            ))
          )}
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