type VisitItem = {
  id: string;
  scheduledAt: Date;
  status: string;
  visitType: string;
  customer: {
    tradeName: string | null;
    legalName: string;
  };
  unit: {
    name: string;
  };
  equipment: {
    equipmentType: string;
    assetTag: string | null;
  };
  technician: {
    name: string;
  } | null;
};

type NextVisitsCardProps = {
  visits: VisitItem[];
};

const visitTypeMap: Record<string, string> = {
  PREVENTIVE: "Preventiva",
  CORRECTIVE: "Corretiva",
  INSTALLATION: "Instalação",
  REPLACEMENT: "Troca",
  REMOVAL: "Retirada",
  INSPECTION: "Inspeção",
};

export function NextVisitsCard({ visits }: NextVisitsCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Próximas visitas
      </h2>

      <div className="mt-4 space-y-3">
        {visits.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhuma visita futura encontrada.
          </p>
        ) : (
          visits.map((visit) => (
            <div key={visit.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    {visit.customer.tradeName || visit.customer.legalName}
                  </p>
                  <p className="text-sm text-slate-600">
                    {visit.unit.name} • {visit.equipment.equipmentType}
                  </p>
                  <p className="text-xs text-slate-500">
                    {visitTypeMap[visit.visitType] ?? visit.visitType}
                  </p>
                </div>

                <div className="text-right text-sm text-slate-500">
                  <div>
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(visit.scheduledAt))}
                  </div>
                  <div>{visit.technician?.name || "Sem técnico"}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}