"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingCart, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
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

  const handleRecordPurchase = (id: string) => {
    startTransition(async () => {
      try {
        await recordCustomerPurchase(id);
        toast.success("Compra do mês registrada com sucesso");
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
                    onClick={() => handleRecordPurchase(alert.id)}
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
    </div>
  );
}
