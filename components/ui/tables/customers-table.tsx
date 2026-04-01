"use client";

import Link from "next/link";
import type { Customer } from "@prisma/client";
import { toggleCustomerStatus } from "@/server/actions/customer-action";
import { useTransition } from "react";

type CustomersTableProps = {
  customers: Customer[];
};

export function CustomersTable({ customers }: CustomersTableProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="overflow-x-auto w-full rounded-2xl border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cliente
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Documento
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
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="px-4 py-4">
                <div className="font-medium text-slate-900">
                  {customer.tradeName || customer.legalName}
                </div>
                {customer.tradeName ? (
                  <div className="text-sm text-slate-500">{customer.legalName}</div>
                ) : null}
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                {customer.document || "-"}
              </td>

              <td className="px-4 py-4 text-sm text-slate-600">
                <div>{customer.email || "-"}</div>
                <div>{customer.phone || ""}</div>
              </td>

              <td className="px-4 py-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    customer.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {customer.isActive ? "Ativo" : "Inativo"}
                </span>
              </td>

              <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700"
                  >
                    Ver
                  </Link>

                  <Link
                    href={`/customers/${customer.id}/edit`}
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700"
                  >
                    Editar
                  </Link>

                  <button
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await toggleCustomerStatus(customer.id, !customer.isActive);
                      })
                    }
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700 disabled:opacity-60"
                  >
                    {customer.isActive ? "Inativar" : "Ativar"}
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {customers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                Nenhum cliente cadastrado.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}