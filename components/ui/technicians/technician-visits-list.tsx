import { VISIT_STATUS_MAP } from "@/lib/constants";

interface TechnicianVisitsListProps {
  visits: any[];
}

export function TechnicianVisitsList({ visits }: TechnicianVisitsListProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Últimas visitas
      </h2>

      <div className="mt-4 space-y-3">
        {visits.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhuma visita encontrada para este técnico.
          </p>
        ) : (
          visits.map((visit) => (
            <div key={visit.id} className="rounded-xl border p-4 hover:border-slate-300 transition-colors">
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
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {VISIT_STATUS_MAP[visit.status] ?? visit.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
