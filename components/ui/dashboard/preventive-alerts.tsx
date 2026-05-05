"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Wrench, CalendarPlus, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

type PreventiveAlert = {
  id: string;
  equipmentType: string;
  brand: string | null;
  assetTag: string | null;
  lastMaintenanceDate: Date | null;
  nextMaintenanceDate: Date | null;
  alertType: "OVERDUE" | "WARNING";
  customer: {
    legalName: string;
    tradeName: string | null;
  };
  unit: {
    name: string;
  };
};

type PreventiveAlertsProps = {
  alerts: PreventiveAlert[];
};

export function PreventiveAlerts({ alerts }: PreventiveAlertsProps) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="rounded-2xl border border-red-100 bg-white shadow-sm overflow-hidden mb-8">
      <div className="flex items-center gap-3 border-b border-red-50 bg-red-50/50 px-6 py-4">
        <Wrench className="h-5 w-5 text-red-600" />
        <h2 className="text-lg font-semibold text-slate-900">
          Manutenções Preventivas (Atenção)
        </h2>
        <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
          {alerts.length}
        </span>
      </div>

      <div className="divide-y divide-slate-100 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="px-6 py-3 font-medium">Equipamento</th>
              <th className="px-6 py-3 font-medium">Cliente / Unidade</th>
              <th className="px-6 py-3 font-medium">Vencimento</th>
              <th className="px-6 py-3 font-medium">Situação</th>
              <th className="px-6 py-3 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">
                    {alert.equipmentType} {alert.brand ? `(${alert.brand})` : ""}
                  </div>
                  {alert.assetTag && (
                    <div className="text-xs text-slate-500">Tag: {alert.assetTag}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-900 text-sm">
                    {alert.customer.tradeName || alert.customer.legalName}
                  </div>
                  <div className="text-xs text-slate-500">{alert.unit.name}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                  {alert.nextMaintenanceDate 
                    ? format(new Date(alert.nextMaintenanceDate), "dd MMM yyyy", { locale: ptBR })
                    : "Desconhecido"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {alert.alertType === "OVERDUE" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                        <AlertTriangle className="h-3 w-3" />
                        Vencida
                      </span>
                    )}
                    {alert.alertType === "WARNING" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                        <Clock className="h-3 w-3" />
                        Vence em {`<= 7 dias`}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/visits/new`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    <CalendarPlus className="h-3.5 w-3.5 text-blue-500" />
                    Agendar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
