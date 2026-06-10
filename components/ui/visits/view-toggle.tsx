"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutList, Columns3 } from "lucide-react";

export function ViewToggle({ currentView }: { currentView: "table" | "kanban" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setView(view: "table" | "kanban") {
    const params = new URLSearchParams(searchParams.toString());
    if (view === "table") params.delete("view");
    else params.set("view", "kanban");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <button
        onClick={() => setView("table")}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          currentView === "table"
            ? "bg-slate-900 text-white"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <LayoutList className="h-4 w-4" />
        Tabela
      </button>
      <button
        onClick={() => setView("kanban")}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          currentView === "kanban"
            ? "bg-slate-900 text-white"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <Columns3 className="h-4 w-4" />
        Kanban
      </button>
    </div>
  );
}
