"use client";

import Link from "next/link";

type EquipmentRow = {
  id: string;
  equipmentType: string;
  brand: string | null;
  model: string | null;
  assetTag: string | null;
  serialNumber: string | null;
  status: string;
  maintenanceFrequencyDays: number | null;
  customer: {
    legalName: string;
    tradeName: string | null;
  };
  unit: {
    name: string;
  };
  visits: {
    id: string;
  }[];
};

type EquipmentTableProps = {
  equipment: EquipmentRow[];
  userRole?: string;
};

const statusMap: Record<string, string> = {
  ACTIVE: "Ativo",
  IN_MAINTENANCE: "Em manutenção",
  REMOVED: "Retirado",
  REPLACED: "Substituído",
  INACTIVE: "Inativo",
};

const statusClassMap: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  IN_MAINTENANCE: "bg-amber-100 text-amber-700",
  REMOVED: "bg-slate-200 text-slate-700",
  REPLACED: "bg-blue-100 text-blue-700",
  INACTIVE: "bg-slate-200 text-slate-700",
};

export function EquipmentTable({ equipment, userRole }: EquipmentTableProps) {
  return (
    <div className="overflow-x-auto w-full rounded-2xl border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Equipamento
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cliente / Unidade
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Identificação
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Frequência
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
          {equipment.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-4">
                <div className="font-medium text-slate-900">
                  {item.equipmentType}
                </div>
                <div className="text-sm text-slate-500">
                  {[item.brand, item.model].filter(Boolean).join(" • ") || "-"}
                </div>
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                <div>{item.customer.tradeName || item.customer.legalName}</div>
                <div>{item.unit.name}</div>
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                <div>Tag: {item.assetTag || "-"}</div>
                <div>S/N: {item.serialNumber || "-"}</div>
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                {item.maintenanceFrequencyDays
                  ? `${item.maintenanceFrequencyDays} dias`
                  : "-"}
              </td>

              <td className="px-4 py-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    statusClassMap[item.status] ?? "bg-slate-100 text-slate-700"
                  }`}
                >
                  {statusMap[item.status] ?? item.status}
                </span>
              </td>

              <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/equipment/${item.id}`}
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Ver
                  </Link>

                  {userRole !== "CUSTOMER" && (
                    <Link
                      href={`/equipment/${item.id}/edit`}
                      className="rounded-lg border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Editar
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {equipment.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                Nenhum equipamento cadastrado.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}