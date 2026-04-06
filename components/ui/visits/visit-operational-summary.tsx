import { VISIT_TYPE_MAP, VISIT_STATUS_MAP } from "@/lib/constants";

interface VisitOperationalSummaryProps {
  visit: any;
}

export function VisitOperationalSummary({ visit }: VisitOperationalSummaryProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Resumo operacional
      </h2>

      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Status atual</span>
          <strong className="text-slate-900">
            {VISIT_STATUS_MAP[visit.status] ?? visit.status}
          </strong>
        </div>

        <div className="flex items-center justify-between">
          <span>Tipo</span>
          <strong className="text-slate-900">
            {VISIT_TYPE_MAP[visit.visitType] ?? visit.visitType}
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
  );
}
