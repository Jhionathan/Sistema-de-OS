"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingBag, Plus, Loader2 } from "lucide-react";
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

  const handleRecordPurchase = () => {
    startTransition(async () => {
      try {
        await recordCustomerPurchase(customerId);
        toast.success("Compra registrada com sucesso!");
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
          onClick={handleRecordPurchase}
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
    </div>
  );
}
