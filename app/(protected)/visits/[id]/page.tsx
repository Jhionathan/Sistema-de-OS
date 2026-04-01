import Link from "next/link";
import { notFound } from "next/navigation";
import { getVisitById } from "@/server/queries/visit-queries";

type VisitDetailPageProps = {
  params: Promise<{ id: string }>;
};

const visitTypeMap: Record<string, string> = {
  PREVENTIVE: "Preventiva",
  CORRECTIVE: "Corretiva",
  INSTALLATION: "Instalação",
  REPLACEMENT: "Troca",
  REMOVAL: "Retirada",
  INSPECTION: "Inspeção",
};

const statusMap: Record<string, string> = {
  SCHEDULED: "Agendada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  CANCELED: "Cancelada",
  PENDING_RETURN: "Pendente retorno",
};

export default async function VisitDetailPage({ params }: VisitDetailPageProps) {
  const { id } = await params;
  const visit = await getVisitById(id);

  if (!visit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {visitTypeMap[visit.visitType] ?? visit.visitType}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {visit.customer.tradeName || visit.customer.legalName} • {visit.unit.name}
          </p>
        </div>

        <Link
          href={`/visits/${visit.id}/edit`}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700"
        >
          Editar
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Dados da visita
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Info label="Cliente" value={visit.customer.tradeName || visit.customer.legalName} />
            <Info label="Unidade" value={visit.unit.name} />
            <Info label="Equipamento" value={visit.equipment.equipmentType} />
            <Info label="Patrimônio / Tag" value={visit.equipment.assetTag} />
            <Info label="Técnico" value={visit.technician?.name ?? null} />
            <Info label="Tipo" value={visitTypeMap[visit.visitType] ?? visit.visitType} />
            <Info label="Status" value={statusMap[visit.status] ?? visit.status} />
            <Info
              label="Data agendada"
              value={new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(visit.scheduledAt))}
            />
            <Info
              label="Início"
              value={
                visit.startedAt
                  ? new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(visit.startedAt))
                  : null
              }
            />
            <Info
              label="Fim"
              value={
                visit.finishedAt
                  ? new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(visit.finishedAt))
                  : null
              }
            />
            <Info label="Precisa retorno" value={visit.requiresReturn ? "Sim" : "Não"} />
            <Info
              label="Data do retorno"
              value={
                visit.returnDueDate
                  ? new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(visit.returnDueDate))
                  : null
              }
            />
            <Info label="Criado por" value={visit.createdBy.name} />
          </div>

          <Section title="Problema relatado" value={visit.reportedIssue} />
          <Section title="Serviço executado" value={visit.servicePerformed} />
          <Section title="Observações técnicas" value={visit.technicalNotes} />
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Resumo operacional
          </h2>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Status atual</span>
              <strong className="text-slate-900">
                {statusMap[visit.status] ?? visit.status}
              </strong>
            </div>

            <div className="flex items-center justify-between">
              <span>Tipo</span>
              <strong className="text-slate-900">
                {visitTypeMap[visit.visitType] ?? visit.visitType}
              </strong>
            </div>

            <div className="flex items-center justify-between">
              <span>Retorno</span>
              <strong className="text-slate-900">
                {visit.requiresReturn ? "Necessário" : "Não"}
              </strong>
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

function Section({
  title,
  value,
}: {
  title: string;
  value: string | null;
}) {
  return (
    <div className="mt-6">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-2 text-sm text-slate-600">
        {value || "Não informado."}
      </p>
    </div>
  );
}