import { VISIT_TYPE_MAP, VISIT_STATUS_MAP } from "@/lib/constants";

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

interface SectionProps {
  title: string;
  value: string | null;
}

function Section({ title, value }: SectionProps) {
  return (
    <div className="mt-6">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-2 text-sm text-slate-600">
        {value || "Não informado."}
      </p>
    </div>
  );
}

interface VisitDetailsCardProps {
  visit: any;
}

export function VisitDetailsCard({ visit }: VisitDetailsCardProps) {
  return (
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
        <Info label="Tipo" value={VISIT_TYPE_MAP[visit.visitType] ?? visit.visitType} />
        <Info label="Status" value={VISIT_STATUS_MAP[visit.status] ?? visit.status} />
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
  );
}
