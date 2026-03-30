import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnitById } from "@/server/queries/unit-queries";
import { requireMasterDataAccess } from "@/lib/auth-guards";


type UnitDetailPageProps = {
  params: Promise<{ id: string }>;
};

const visitStatusMap: Record<string, string> = {
  SCHEDULED: "Agendada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  CANCELED: "Cancelada",
  PENDING_RETURN: "Pendente retorno",
};

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  await requireMasterDataAccess();
  
  const { id } = await params;
  const unit = await getUnitById(id);

  if (!unit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {unit.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {unit.customer.tradeName || unit.customer.legalName}
          </p>
        </div>

        <Link
          href={`/units/${unit.id}/edit`}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700"
        >
          Editar
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
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

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Resumo</h2>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Equipamentos</span>
                <strong className="text-slate-900">{unit.equipment.length}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span>Últimas visitas</span>
                <strong className="text-slate-900">{unit.visits.length}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Últimas visitas
            </h2>

            <div className="mt-4 space-y-3">
              {unit.visits.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Nenhuma visita encontrada.
                </p>
              ) : (
                unit.visits.map((visit) => (
                  <div key={visit.id} className="rounded-xl border p-3">
                    <p className="font-medium text-slate-900">
                      {visitStatusMap[visit.status] ?? visit.status}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(visit.scheduledAt))}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {visit.technician?.name ?? "Sem técnico"}
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