"use client";

import Link from "next/link";

type VisitRow = {
  id: string;
  scheduledAt: Date;
  visitType: string;
  status: string;
  requiresReturn: boolean;
  customer: {
    legalName: string;
    tradeName: string | null;
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

type VisitsTableProps = {
  visits: VisitRow[];
  userRole?: string;
};

const visitTypeMap: Record<string, string> = {
  PREVENTIVE: "Preventiva",
  CORRECTIVE: "Corretiva",
  INSTALLATION: "Instalação",
  REPLACEMENT: "Troca",
  REMOVAL: "Retirada",
  INSPECTION: "Inspeção",
};

const statusMap: Record<string, string> = {
  REQUESTED: "Aberto (Triagem)",
  SCHEDULED: "Agendada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  CANCELED: "Cancelada",
  PENDING_RETURN: "Pendente retorno",
};

const statusClassMap: Record<string, string> = {
  REQUESTED: "bg-orange-100 text-orange-700 font-bold border border-orange-200 shadow-sm",
  SCHEDULED: "bg-[#6b7747]/15 text-[#6b7747]",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELED: "bg-slate-200 text-slate-700",
  PENDING_RETURN: "bg-red-100 text-red-700",
};

export function VisitsTable({ visits, userRole }: VisitsTableProps) {
  return (
    <div className="overflow-x-auto w-full rounded-2xl border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Visita
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cliente / Unidade
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Equipamento
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Técnico
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {visits.map((visit) => (
            <tr key={visit.id}>
              <td className="px-4 py-4">
                <div className="font-medium text-slate-900">
                  {visitTypeMap[visit.visitType] ?? visit.visitType}
                </div>
                <div className="text-sm text-slate-500">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(visit.scheduledAt))}
                </div>
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                <div>{visit.customer.tradeName || visit.customer.legalName}</div>
                <div>{visit.unit.name}</div>
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                <div>{visit.equipment.equipmentType}</div>
                <div>{visit.equipment.assetTag || "-"}</div>
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                {visit.technician?.name || "-"}
              </td>

              <td className="px-4 py-4">
                <div className="flex flex-col gap-2">
                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusClassMap[visit.status] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {statusMap[visit.status] ?? visit.status}
                  </span>

                  {visit.requiresReturn ? (
                    <span className="w-fit rounded-full bg-red-50 px-2.5 py-1 text-xs text-red-700">
                      Requer retorno
                    </span>
                  ) : null}
                </div>
              </td>

              <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/visits/${visit.id}`}
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Ver
                  </Link>

                  {userRole !== "CUSTOMER" && (
                    <Link
                      href={`/visits/${visit.id}/edit`}
                      className="rounded-lg border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Editar
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {visits.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                Nenhuma visita cadastrada.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}