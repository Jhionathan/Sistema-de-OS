"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Play, CheckCircle2, Clock, MapPin, Cpu, ArrowRight, Sun } from "lucide-react";
import { quickUpdateVisitStatus } from "@/server/actions/visit-action";

type TodayVisit = {
  id: string;
  scheduledAt: Date;
  visitType: string;
  status: string;
  priority: string;
  customer: { legalName: string; tradeName: string | null };
  unit: { name: string; city: string | null };
  equipment: { equipmentType: string; assetTag: string | null };
};

const visitTypeMap: Record<string, string> = {
  PREVENTIVE: "Preventiva",
  CORRECTIVE: "Corretiva",
  INSTALLATION: "Instalação",
  REPLACEMENT: "Troca",
  REMOVAL: "Retirada",
  INSPECTION: "Inspeção",
};

const priorityBg: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-50 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700 animate-pulse",
};

function VisitItem({ visit }: { visit: TodayVisit }) {
  const [pending, startTransition] = useTransition();

  function handleAction(newStatus: "IN_PROGRESS" | "COMPLETED") {
    startTransition(async () => {
      try {
        await quickUpdateVisitStatus(visit.id, newStatus);
        toast.success(
          newStatus === "IN_PROGRESS" ? "Visita iniciada!" : "Visita concluída!"
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao atualizar status.");
      }
    });
  }

  const isScheduled = visit.status === "SCHEDULED";
  const isInProgress = visit.status === "IN_PROGRESS";

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isInProgress
          ? "border-amber-300 bg-amber-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: status indicator + time */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              isInProgress ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {new Intl.DateTimeFormat("pt-BR", { timeStyle: "short" }).format(
                new Date(visit.scheduledAt)
              )}
            </p>
            <p className="text-xs text-slate-500">{visitTypeMap[visit.visitType] ?? visit.visitType}</p>
          </div>
        </div>

        {/* Center: info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {visit.customer.tradeName || visit.customer.legalName}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {visit.unit.name}
              {visit.unit.city ? ` · ${visit.unit.city}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <Cpu className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {visit.equipment.equipmentType}
              {visit.equipment.assetTag ? ` · ${visit.equipment.assetTag}` : ""}
            </span>
          </div>
        </div>

        {/* Right: priority + actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
              priorityBg[visit.priority] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {visit.priority === "URGENT" ? "Urgente" : visit.priority === "HIGH" ? "Alta" : visit.priority === "MEDIUM" ? "Média" : "Baixa"}
          </span>

          <div className="flex gap-1.5">
            {isScheduled && (
              <button
                onClick={() => handleAction("IN_PROGRESS")}
                disabled={pending}
                className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-60 transition-colors"
              >
                <Play className="h-3 w-3" />
                Iniciar
              </button>
            )}
            {isInProgress && (
              <button
                onClick={() => handleAction("COMPLETED")}
                disabled={pending}
                className="flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60 transition-colors"
              >
                <CheckCircle2 className="h-3 w-3" />
                Concluir
              </button>
            )}
            <Link
              href={`/visits/${visit.id}`}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TechnicianTodayVisits({ visits }: { visits: TodayVisit[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <Sun className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Visitas de hoje</h3>
            <p className="text-xs text-slate-500">Atendimentos agendados e em andamento</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
          {visits.length}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {visits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-400 mb-2" />
            <p className="text-sm font-medium text-slate-600">Nenhuma visita pendente hoje</p>
            <p className="text-xs text-slate-400 mt-0.5">Aproveite para adiantar registros!</p>
          </div>
        ) : (
          visits.map((v) => <VisitItem key={v.id} visit={v} />)
        )}
      </div>
    </div>
  );
}
