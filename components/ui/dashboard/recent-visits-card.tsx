import Link from "next/link";

type VisitItem = {
  id: string;
  scheduledAt: Date;
  status: string;
  visitType: string;
  equipment: {
    equipmentType: string;
    assetTag: string | null;
  };
  customer: {
    tradeName: string | null;
    legalName: string;
  };
  technician: {
    name: string;
  } | null;
};

type RecentVisitsCardProps = {
  visits: VisitItem[];
};

const statusMap: Record<string, string> = {
  SCHEDULED: "Agendada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  CANCELED: "Cancelada",
  PENDING_RETURN: "Pendente retorno",
};

const visitTypeMap: Record<string, string> = {
  PREVENTIVE: "Preventiva",
  CORRECTIVE: "Corretiva",
  INSTALLATION: "Instalação",
  REPLACEMENT: "Troca",
  REMOVAL: "Retirada",
  INSPECTION: "Inspeção",
};

export function RecentVisitsCard({ visits }: RecentVisitsCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Últimas visitas
        </h2>

        <Link
          href="/visits"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Ver todas
        </Link>
      </div>

      <div className="mt-4 space-y-4">
        {visits.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhuma visita encontrada.
          </p>
        ) : (
          visits.map((visit) => (
            <div
              key={visit.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    {visit.customer.tradeName ?? visit.customer.legalName}
                  </p>
                  <p className="text-sm text-slate-600">
                    {visit.equipment.equipmentType}
                    {visit.equipment.assetTag
                      ? ` • ${visit.equipment.assetTag}`
                      : ""}
                  </p>
                </div>

                <div className="text-sm text-slate-500">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(visit.scheduledAt))}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                  {visitTypeMap[visit.visitType] ?? visit.visitType}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                  {statusMap[visit.status] ?? visit.status}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                  {visit.technician?.name ?? "Sem técnico"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}