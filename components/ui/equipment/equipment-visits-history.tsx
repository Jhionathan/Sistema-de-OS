import { VISIT_STATUS_MAP } from "@/lib/constants";

interface Visit {
  id: string;
  status: string;
  scheduledAt: string | Date;
  technician?: {
    name: string;
  } | null;
}

interface EquipmentVisitsHistoryProps {
  visits: Visit[];
}

export function EquipmentVisitsHistory({ visits }: EquipmentVisitsHistoryProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Últimas visitas
      </h2>

      <div className="mt-4 space-y-3">
        {visits.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhuma visita encontrada.
          </p>
        ) : (
          visits.map((visit) => (
            <div key={visit.id} className="rounded-xl border p-3">
              <p className="font-medium text-slate-900">
                {VISIT_STATUS_MAP[visit.status] ?? visit.status}
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
  );
}
