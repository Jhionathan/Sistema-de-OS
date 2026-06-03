"use client";

import { useTransition, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingCart, CheckCircle2, AlertTriangle, Clock, X } from "lucide-react";
import { recordCustomerPurchase } from "@/server/actions/customer-action";
import { toast } from "sonner";

type PurchaseAlert = {
  id: string;
  legalName: string;
  tradeName: string | null;
  lastPurchaseDate: Date | null;
  purchaseFrequencyDays: number | null;
  nextPurchaseDate: Date | null;
  alertType: "OVERDUE" | "WARNING" | "MONTHLY_PENDING";
  isCurrentMonth: boolean;
};

type PurchaseAlertsProps = {
  alerts: PurchaseAlert[];
};

export function PurchaseAlerts({ alerts }: PurchaseAlertsProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedAlert, setSelectedAlert] = useState<PurchaseAlert | null>(null);
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

  const openRegisterModal = (alert: PurchaseAlert) => {
    setSelectedAlert(alert);
    setPurchaseDate(getTodayDateString());
    setNotes("");
    setAmount("");
  };

  const handleRecordPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert) return;

    startTransition(async () => {
      try {
        const [year, month, day] = purchaseDate.split("-").map(Number);
        const dateObj = new Date(year, month - 1, day, 12, 0, 0);

        const parsedAmount = amount ? parseFloat(amount) : undefined;
        const parsedNotes = notes.trim() || undefined;

        await recordCustomerPurchase(selectedAlert.id, parsedNotes, parsedAmount, dateObj);
        toast.success("Compra registrada com sucesso");
        setSelectedAlert(null);
      } catch (error) {
        toast.error("Erro ao registrar compra");
      }
    });
  };

  if (alerts.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <ShoppingCart className="h-5 w-5 text-slate-600" />
        <h2 className="text-lg font-semibold text-slate-900">
          Alertas de Compra (Comodato)
        </h2>
        <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
          {alerts.length}
        </span>
      </div>

      <div className="divide-y divide-slate-100 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="px-6 py-3 font-medium">Cliente</th>
              <th className="px-6 py-3 font-medium">Última Compra</th>
              <th className="px-6 py-3 font-medium">Situação</th>
              <th className="px-6 py-3 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">
                    {alert.tradeName || alert.legalName}
                  </div>
                  {alert.tradeName && (
                    <div className="text-xs text-slate-500">{alert.legalName}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                  {alert.lastPurchaseDate 
                    ? format(new Date(alert.lastPurchaseDate), "dd MMM yyyy", { locale: ptBR })
                    : "Nunca registrada"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {alert.alertType === "MONTHLY_PENDING" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                        <Clock className="h-3 w-3" />
                        Pendente no Mês
                      </span>
                    )}
                    {alert.alertType === "OVERDUE" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                        <AlertTriangle className="h-3 w-3" />
                        Atrasado
                      </span>
                    )}
                    {alert.alertType === "WARNING" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        <Clock className="h-3 w-3" />
                        Vence Amanhã
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openRegisterModal(alert)}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Registrar Compra
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-900">Registrar Compra</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPurchase} className="p-6 space-y-4 text-left">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</span>
                <p className="font-medium text-slate-900 mt-0.5">
                  {selectedAlert.tradeName || selectedAlert.legalName}
                </p>
              </div>

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
                  onClick={() => setSelectedAlert(null)}
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
