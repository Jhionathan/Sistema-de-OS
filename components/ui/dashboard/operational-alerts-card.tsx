type OperationalAlertsCardProps = {
  overdueVisits: number;
  pendingReturns: number;
  equipmentInMaintenance: number;
};

export function OperationalAlertsCard({
  overdueVisits,
  pendingReturns,
  equipmentInMaintenance,
}: OperationalAlertsCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Alertas operacionais
      </h2>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
          <span className="text-sm text-slate-600">Visitas atrasadas</span>
          <strong className="text-red-600">{overdueVisits}</strong>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
          <span className="text-sm text-slate-600">Pendentes de retorno</span>
          <strong className="text-amber-600">{pendingReturns}</strong>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
          <span className="text-sm text-slate-600">
            Equipamentos em manutenção
          </span>
          <strong className="text-[#6b7747]">{equipmentInMaintenance}</strong>
        </div>
      </div>
    </div>
  );
}