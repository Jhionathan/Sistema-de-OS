"use client";

import { useTransition, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingBag, Plus, Loader2, X } from "lucide-react";
import { recordCustomerPurchase } from "@/server/actions/customer-action";
import { toast } from "sonner";

type Purchase = {
  id: string;
  amount: number | null;
  notes: string | null;
  purchasedAt: Date;
};

type CustomerPurchasesListProps = {
  customerId: string;
  purchases: Purchase[];
};

export function CustomerPurchasesList({ customerId, purchases }: CustomerPurchasesListProps) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const openRegisterModal = () => {
    setPurchaseDate(getTodayDateString());
    setNotes("");
    setAmount("");
    setIsModalOpen(true);
  };

  const handleRecordPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const [year, month, day] = purchaseDate.split("-").map(Number);
        const dateObj = new Date(year, month - 1, day, 12, 0, 0);

        const parsedAmount = amount ? parseFloat(amount) : undefined;
        const parsedNotes = notes.trim() || undefined;

        await recordCustomerPurchase(customerId, parsedNotes, parsedAmount, dateObj);
        toast.success("Compra registrada com sucesso!");
        setIsModalOpen(false);
      } catch (error) {
        toast.error("Erro ao registrar compra.");
      }
    });
  };

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-slate-600" />
          <h2 className="text-base font-semibold text-slate-900">
            Histórico de Compras
          </h2>
        </div>
        <button
          onClick={openRegisterModal}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          Registrar Compra
        </button>
      </div>
      
      {purchases.length === 0 ? (
        <div className="flex-1 p-8 text-center flex flex-col justify-center h-[200px]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
            <ShoppingBag className="h-6 w-6 text-slate-300" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            Nenhuma compra registrada
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-xs mx-auto">
            As compras de cota de comodato deste cliente aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
              <div>
                <div className="font-medium text-slate-900 capitalize">
                  {format(new Date(purchase.purchasedAt), "MMMM 'de' yyyy", { locale: ptBR })}
                </div>
                <div className="text-sm text-slate-500">
                  {format(new Date(purchase.purchasedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  {purchase.notes && ` - ${purchase.notes}`}
                </div>
              </div>
              {purchase.amount && (
                <div className="font-medium text-emerald-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.amount)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-900">Registrar Compra</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPurchase} className="p-6 space-y-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Data da Compra</label>
                <input
                  type="date"
                  required
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Valor (Opcional)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex.: 150.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Observações (Opcional)</label>
                <textarea
                  placeholder="Ex.: Compra da cota mensal"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 min-h-[80px]"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isPending ? "Registrando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
