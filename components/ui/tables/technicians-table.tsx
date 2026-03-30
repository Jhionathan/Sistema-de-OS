"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toggleTechnicianStatus } from "@/server/actions/technician-action";

type TechnicianRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  visits: {
    id: string;
  }[];
};

type TechniciansTableProps = {
  technicians: TechnicianRow[];
};

export function TechniciansTable({ technicians }: TechniciansTableProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Técnico
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Contato
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Usuário vinculado
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Visitas
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
          {technicians.map((technician) => (
            <tr key={technician.id}>
              <td className="px-4 py-4">
                <div className="font-medium text-slate-900">
                  {technician.name}
                </div>
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                <div>{technician.email || "-"}</div>
                <div>{technician.phone || ""}</div>
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                {technician.user ? (
                  <div>
                    <div>{technician.user.email}</div>
                    <div className="text-xs text-slate-500">
                      {technician.user.role}
                    </div>
                  </div>
                ) : (
                  "-"
                )}
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                {technician.visits.length}
              </td>

              <td className="px-4 py-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    technician.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {technician.isActive ? "Ativo" : "Inativo"}
                </span>
              </td>

              <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/technicians/${technician.id}`}
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700"
                  >
                    Ver
                  </Link>

                  <Link
                    href={`/technicians/${technician.id}/edit`}
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700"
                  >
                    Editar
                  </Link>

                  <button
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await toggleTechnicianStatus(
                          technician.id,
                          !technician.isActive
                        );
                      })
                    }
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700 disabled:opacity-60"
                  >
                    {technician.isActive ? "Inativar" : "Ativar"}
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {technicians.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-10 text-center text-sm text-slate-500"
              >
                Nenhum técnico cadastrado.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}