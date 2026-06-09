"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export function UnitsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const urlQuery = searchParams.get("query") || "";
  const [prevUrlQuery, setPrevUrlQuery] = useState("");

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    if (urlQuery !== debouncedSearch) setSearch(urlQuery);
  }

  const getQueryString = useCallback((params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParamsRef.current.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") newSearchParams.delete(key);
      else newSearchParams.set(key, value);
    });
    newSearchParams.set("page", "1");
    return newSearchParams.toString();
  }, []);

  useEffect(() => {
    const currentQuery = searchParamsRef.current.get("query") || "";
    if (debouncedSearch !== currentQuery) {
      router.push(`${pathname}?${getQueryString({ query: debouncedSearch })}`);
    }
  }, [debouncedSearch, pathname, router, getQueryString]);

  const clearFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row items-end gap-3">
        <div className="w-full md:flex-1 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
            Buscar unidade
          </label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#6b7747] transition-colors" />
            <input
              type="text"
              placeholder="Nome, cidade, contato ou cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6b7747]/20 focus:border-[#6b7747] transition-all"
            />
          </div>
        </div>

        {search && (
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
