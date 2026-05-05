"use client";

import { useState, useTransition } from "react";
import { Wrench, Plus, Trash2, Loader2, Package } from "lucide-react";
import { addVisitPart, removeVisitPart } from "@/server/actions/visit-parts-action";
import { toast } from "sonner";

type Part = {
  id: string;
  name: string;
  partNumber: string | null;
  quantity: number;
  unitCost: number | null;
};

type VisitPartsListProps = {
  visitId: string;
  parts: Part[];
  readOnly?: boolean;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function VisitPartsList({ visitId, parts, readOnly = false }: VisitPartsListProps) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    partNumber: "",
    quantity: "1",
    unitCost: "",
  });

  const totalCost = parts.reduce(
    (acc, p) => acc + (p.unitCost ? p.unitCost * p.quantity : 0),
    0
  );

  const handleAdd = () => {
    startTransition(async () => {
      try {
        await addVisitPart({
          visitId,
          name: form.name,
          partNumber: form.partNumber || undefined,
          quantity: Number(form.quantity) || 1,
          unitCost: form.unitCost ? Number(form.unitCost) : undefined,
        });
        toast.success("Peça adicionada!");
        setForm({ name: "", partNumber: "", quantity: "1", unitCost: "" });
        setShowForm(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao adicionar peça.");
      }
    });
  };

  const handleRemove = (partId: string) => {
    startTransition(async () => {
      try {
        await removeVisitPart(partId, visitId);
        toast.success("Peça removida.");
      } catch {
        toast.error("Erro ao remover peça.");
      }
    });
  };

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-slate-600" />
          <h2 className="text-base font-semibold text-slate-900">Peças Utilizadas</h2>
          {parts.length > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
              {parts.length}
            </span>
          )}
        </div>
        {!readOnly && (
          <button
            onClick={() => setShowForm((v) => !v)}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            {showForm ? "Cancelar" : "Adicionar peça"}
          </button>
        )}
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="border-b border-slate-100 bg-slate-50 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Nome da peça *
              </label>
              <input
                type="text"
                placeholder="ex: Filtro de ar"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Código / Part#
              </label>
              <input
                type="text"
                placeholder="ex: FLT-001"
                value={form.partNumber}
                onChange={(e) => setForm((f) => ({ ...f, partNumber: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Qtd.</label>
              <input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Custo unit. (R$)
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                placeholder="0,00"
                value={form.unitCost}
                onChange={(e) => setForm((f) => ({ ...f, unitCost: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAdd}
              disabled={isPending || !form.name.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* Parts list */}
      {parts.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
            <Package className="h-6 w-6 text-slate-300" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-700">Nenhuma peça registrada</p>
          <p className="mt-1 text-xs text-slate-400">
            {readOnly
              ? "Nenhuma peça foi utilizada nesta OS."
              : "Clique em \"Adicionar peça\" para registrar itens utilizados."}
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-slate-100">
            {parts.map((part) => (
              <div
                key={part.id}
                className="flex items-center justify-between gap-4 px-6 py-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{part.name}</p>
                  {part.partNumber && (
                    <p className="text-xs text-slate-400">Part# {part.partNumber}</p>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-slate-500">
                    Qtd.&nbsp;<strong className="text-slate-800">{part.quantity}</strong>
                  </span>
                  <span className="w-24 text-right font-medium text-slate-700">
                    {part.unitCost != null
                      ? currency.format(part.unitCost * part.quantity)
                      : "—"}
                  </span>
                  {!readOnly && (
                    <button
                      onClick={() => handleRemove(part.id)}
                      disabled={isPending}
                      className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-40"
                      title="Remover peça"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          {totalCost > 0 && (
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-3">
              <span className="text-sm text-slate-500">Total em peças:</span>
              <span className="text-sm font-semibold text-slate-900">{currency.format(totalCost)}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
