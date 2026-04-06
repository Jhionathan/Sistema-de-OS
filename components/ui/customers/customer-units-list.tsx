interface Unit {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
}

interface CustomerUnitsListProps {
  units: Unit[];
}

export function CustomerUnitsList({ units }: CustomerUnitsListProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Unidades vinculadas
      </h2>

      <div className="mt-4 space-y-3">
        {units.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhuma unidade cadastrada.
          </p>
        ) : (
          units.map((unit) => (
            <div key={unit.id} className="rounded-xl border p-3">
              <p className="font-medium text-slate-900">{unit.name}</p>
              <p className="text-sm text-slate-500">
                {unit.city || "-"} / {unit.state || "-"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
