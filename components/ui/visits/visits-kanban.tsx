import Link from "next/link";
import { CalendarDays, User, Cpu, ArrowRight } from "lucide-react";

type VisitCard = {
  id: string;
  scheduledAt: Date;
  visitType: string;
  status: string;
  priority: string;
  requiresReturn: boolean;
  customer: { legalName: string; tradeName: string | null };
  unit: { name: string };
  equipment: { equipmentType: string; assetTag: string | null };
  technician: { name: string } | null;
};

type VisitsKanbanProps = {
  visits: VisitCard[];
  userRole?: string;
};

const COLUMNS: { key: string; label: string; headerClass: string; dotClass: string }[] = [
  { key: "REQUESTED",      label: "Triagem",           headerClass: "bg-orange-50 border-orange-200",  dotClass: "bg-orange-400" },
  { key: "SCHEDULED",      label: "Agendada",          headerClass: "bg-[#6b7747]/10 border-[#6b7747]/20", dotClass: "bg-[#6b7747]" },
  { key: "IN_PROGRESS",    label: "Em andamento",      headerClass: "bg-amber-50 border-amber-200",    dotClass: "bg-amber-400" },
  { key: "PENDING_RETURN", label: "Pendente retorno",  headerClass: "bg-red-50 border-red-200",        dotClass: "bg-red-400" },
  { key: "COMPLETED",      label: "Concluída",         headerClass: "bg-green-50 border-green-200",    dotClass: "bg-green-500" },
  { key: "CANCELED",       label: "Cancelada",         headerClass: "bg-slate-50 border-slate-200",    dotClass: "bg-slate-400" },
];

const visitTypeMap: Record<string, string> = {
  PREVENTIVE:   "Preventiva",
  CORRECTIVE:   "Corretiva",
  INSTALLATION: "Instalação",
  REPLACEMENT:  "Troca",
  REMOVAL:      "Retirada",
  INSPECTION:   "Inspeção",
};

const priorityBadge: Record<string, string> = {
  LOW:    "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-50 text-blue-700",
  HIGH:   "bg-orange-100 text-orange-700 font-bold",
  URGENT: "bg-red-100 text-red-700 font-bold",
};

const priorityLabel: Record<string, string> = {
  LOW: "Baixa", MEDIUM: "Média", HIGH: "Alta", URGENT: "Urgente",
};

function KanbanCard({ visit, userRole }: { visit: VisitCard; userRole?: string }) {
  const isOverdue =
    visit.status !== "COMPLETED" &&
    visit.status !== "CANCELED" &&
    new Date(visit.scheduledAt) < new Date();

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-2.5">
      {/* Top row: type + priority */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700">
          {visitTypeMap[visit.visitType] ?? visit.visitType}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${priorityBadge[visit.priority] ?? "bg-slate-100 text-slate-600"}`}>
          {priorityLabel[visit.priority] ?? visit.priority}
        </span>
      </div>

      {/* Customer / unit */}
      <div>
        <p className="text-sm font-medium text-slate-900 leading-tight truncate">
          {visit.customer.tradeName || visit.customer.legalName}
        </p>
        <p className="text-xs text-slate-500 truncate">{visit.unit.name}</p>
      </div>

      {/* Equipment */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Cpu className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">
          {visit.equipment.equipmentType}
          {visit.equipment.assetTag ? ` · ${visit.equipment.assetTag}` : ""}
        </span>
      </div>

      {/* Technician */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <User className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{visit.technician?.name ?? "Sem técnico"}</span>
      </div>

      {/* Date */}
      <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-red-600 font-medium" : "text-slate-500"}`}>
        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
        <span>
          {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(visit.scheduledAt))}
          {isOverdue && " · Atrasada"}
        </span>
      </div>

      {visit.requiresReturn && (
        <div className="rounded-lg bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600 uppercase tracking-wide">
          Requer retorno
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-0.5">
        <Link
          href={`/visits/${visit.id}`}
          className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Ver
          <ArrowRight className="h-3 w-3" />
        </Link>
        {userRole !== "CUSTOMER" && (
          <Link
            href={`/visits/${visit.id}/edit`}
            className="flex-1 flex items-center justify-center rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Editar
          </Link>
        )}
      </div>
    </div>
  );
}

export function VisitsKanban({ visits, userRole }: VisitsKanbanProps) {
  const grouped = Object.fromEntries(
    COLUMNS.map((col) => [col.key, visits.filter((v) => v.status === col.key)])
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
      {COLUMNS.map((col) => {
        const cards = grouped[col.key] ?? [];
        return (
          <div key={col.key} className="flex-shrink-0 w-72">
            {/* Column header */}
            <div className={`mb-3 flex items-center justify-between rounded-xl border px-3 py-2 ${col.headerClass}`}>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${col.dotClass}`} />
                <span className="text-sm font-semibold text-slate-700">{col.label}</span>
              </div>
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold text-slate-600 shadow-sm">
                {cards.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2.5">
              {cards.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                  Nenhuma visita
                </div>
              ) : (
                cards.map((visit) => (
                  <KanbanCard key={visit.id} visit={visit} userRole={userRole} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
