"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type TechnicianOption = {
  id: string;
  name: string;
};

type CustomerOption = {
  id: string;
  legalName: string;
  tradeName: string | null;
};

type VisitsFiltersProps = {
  technicians: TechnicianOption[];
  customers: CustomerOption[];
};

export function VisitsFilters({
  technicians,
  customers,
}: VisitsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function clearFilters() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            defaultValue={searchParams.get("status") ?? ""}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            disabled={isPending}
          >
            <option value="">Todos</option>
            <option value="REQUESTED">Aberto (Triagem)</option>
            <option value="SCHEDULED">Agendada</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="COMPLETED">Concluída</option>
            <option value="CANCELED">Cancelada</option>
            <option value="PENDING_RETURN">Pendente retorno</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tipo
          </label>
          <select
            defaultValue={searchParams.get("visitType") ?? ""}
            onChange={(e) => updateFilter("visitType", e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            disabled={isPending}
          >
            <option value="">Todos</option>
            <option value="PREVENTIVE">Preventiva</option>
            <option value="CORRECTIVE">Corretiva</option>
            <option value="INSTALLATION">Instalação</option>
            <option value="REPLACEMENT">Troca</option>
            <option value="REMOVAL">Retirada</option>
            <option value="INSPECTION">Inspeção</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Técnico
          </label>
          <select
            defaultValue={searchParams.get("technicianId") ?? ""}
            onChange={(e) => updateFilter("technicianId", e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            disabled={isPending}
          >
            <option value="">Todos</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Cliente
          </label>
          <select
            defaultValue={searchParams.get("customerId") ?? ""}
            onChange={(e) => updateFilter("customerId", e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            disabled={isPending}
          >
            <option value="">Todos</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.tradeName || customer.legalName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={clearFilters}
            disabled={isPending}
            className="w-full rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Data inicial
          </label>
          <input
            type="date"
            defaultValue={searchParams.get("dateFrom") ?? ""}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Data final
          </label>
          <input
            type="date"
            defaultValue={searchParams.get("dateTo") ?? ""}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            disabled={isPending}
          />
        </div>
      </div>
    </div>
  );
}