"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

type CustomerOption = {
  id: string;
  legalName: string;
  tradeName: string | null;
};

interface EquipmentFiltersProps {
  customers: CustomerOption[];
  userRole?: string;
}

export function EquipmentFilters({ customers, userRole }: EquipmentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [customerId, setCustomerId] = useState(searchParams.get("customerId") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  
  const debouncedSearch = useDebounce(search, 500);

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });
      
      // Reset page when filters change
      newSearchParams.set("page", "1");

      return newSearchParams.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const query = createQueryString({ query: debouncedSearch });
    if (query !== searchParams.toString()) {
      router.push(`${pathname}?${query}`);
    }
  }, [debouncedSearch, pathname, router, createQueryString, searchParams]);

  const handleFilterChange = (name: string, value: string) => {
    if (name === "customerId") setCustomerId(value);
    if (name === "status") setStatus(value);

    const query = createQueryString({ [name]: value });
    router.push(`${pathname}?${query}`);
  };

  const clearFilters = () => {
    setSearch("");
    setCustomerId("");
    setStatus("");
    router.push(pathname);
  };

  const hasFilters = search || customerId || status;

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row items-end gap-3">
        <div className="w-full md:flex-1 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
            Buscar equipamento
          </label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#6b7747] transition-colors" />
            <input
              type="text"
              placeholder="Tipo, marca, modelo, tag ou S/N..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6b7747]/20 focus:border-[#6b7747] transition-all"
            />
          </div>
        </div>

        {userRole !== "CUSTOMER" && (
          <div className="w-full md:w-64 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
              Cliente
            </label>
            <select
              value={customerId}
              onChange={(e) => handleFilterChange("customerId", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6b7747]/20 focus:border-[#6b7747] transition-all cursor-pointer appearance-none"
            >
              <option value="">Todos os clientes</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.tradeName || c.legalName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="w-full md:w-48 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6b7747]/20 focus:border-[#6b7747] transition-all cursor-pointer appearance-none"
          >
            <option value="">Qualquer status</option>
            <option value="ACTIVE">Ativo</option>
            <option value="IN_MAINTENANCE">Em manutenção</option>
            <option value="REMOVED">Retirado</option>
            <option value="REPLACED">Substituído</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="h-10 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
