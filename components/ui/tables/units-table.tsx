"use client";

import Link from "next/link";
import { toggleUnitStatus } from "@/server/actions/unit-action";
import { useTransition } from "react";

type UnitRow = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  contactName: string | null;
  contactPhone: string | null;
  isActive: boolean;
  customer: {
    legalName: string;
    tradeName: string | null;
  };
  equipment: { id: string }[];
  visits: { id: string }[];
};

type UnitsTableProps = {
  units: UnitRow[];
};

export function UnitsTable({ units }: UnitsTableProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Unidade
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cliente
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Local
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Contato
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
          {units.map((unit) => (
            <tr key={unit.id}>
              <td className="px-4 py-4">
                <div className="font-medium text-slate-900">{unit.name}</div>
                <div className="text-sm text-slate-500">
                  {unit.equipment.length} equipamentos • {unit.visits.length} visitas
                </div>
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                {unit.customer.tradeName || unit.customer.legalName}
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                {unit.city || "-"} / {unit.state || "-"}
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                <div>{unit.contactName || "-"}</div>
                <div>{unit.contactPhone || ""}</div>
              </td>

              <td className="px-4 py-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    unit.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {unit.isActive ? "Ativa" : "Inativa"}
                </span>
              </td>

              <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/units/${unit.id}`}
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700"
                  >
                    Ver
                  </Link>

                  <Link
                    href={`/units/${unit.id}/edit`}
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700"
                  >
                    Editar
                  </Link>

                  <button
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await toggleUnitStatus(unit.id, !unit.isActive);
                      })
                    }
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700 disabled:opacity-60"
                  >
                    {unit.isActive ? "Inativar" : "Ativar"}
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {units.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                Nenhuma unidade cadastrada.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}