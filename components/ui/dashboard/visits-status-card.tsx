type VisitsStatusCardProps = {
  visitsByStatus: {
    SCHEDULED: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    CANCELED: number;
    PENDING_RETURN: number;
  };
};

const labels = {
  SCHEDULED: "Agendadas",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluídas",
  CANCELED: "Canceladas",
  PENDING_RETURN: "Pend. retorno",
};

const styles = {
  SCHEDULED: "bg-[#6b7747]/15 text-[#6b7747]",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELED: "bg-slate-200 text-slate-700",
  PENDING_RETURN: "bg-red-100 text-red-700",
};

export function VisitsStatusCard({ visitsByStatus }: VisitsStatusCardProps) {
  const items = Object.entries(visitsByStatus) as Array<
    [keyof typeof visitsByStatus, number]
  >;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Visitas por status
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
          >
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[key]}`}
            >
              {labels[key]}
            </span>

            <strong className="text-slate-900">{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}