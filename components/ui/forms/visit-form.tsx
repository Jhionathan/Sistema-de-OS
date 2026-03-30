"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Equipment, Technician, Visit, Customer, CustomerUnit } from "@prisma/client";
import { createVisit, updateVisit } from "@/server/actions/visit-action";

type EquipmentOption = Equipment & {
  customer: Customer;
  unit: CustomerUnit;
};

type VisitFormProps = {
  visit?: Visit | null;
  equipment: EquipmentOption[];
  technicians: Technician[];
};

const visitTypeOptions = [
  { value: "PREVENTIVE", label: "Preventiva" },
  { value: "CORRECTIVE", label: "Corretiva" },
  { value: "INSTALLATION", label: "Instalação" },
  { value: "REPLACEMENT", label: "Troca" },
  { value: "REMOVAL", label: "Retirada" },
  { value: "INSPECTION", label: "Inspeção" },
] as const;

const statusOptions = [
  { value: "SCHEDULED", label: "Agendada" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "COMPLETED", label: "Concluída" },
  { value: "CANCELED", label: "Cancelada" },
  { value: "PENDING_RETURN", label: "Pendente retorno" },
] as const;

export function VisitForm({ visit, equipment, technicians }: VisitFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [equipmentId, setEquipmentId] = useState(visit?.equipmentId ?? "");
  const [technicianId, setTechnicianId] = useState(visit?.technicianId ?? "");
  const [scheduledAt, setScheduledAt] = useState(
    visit?.scheduledAt
      ? new Date(visit.scheduledAt).toISOString().slice(0, 16)
      : ""
  );
  const [startedAt, setStartedAt] = useState(
    visit?.startedAt
      ? new Date(visit.startedAt).toISOString().slice(0, 16)
      : ""
  );
  const [finishedAt, setFinishedAt] = useState(
    visit?.finishedAt
      ? new Date(visit.finishedAt).toISOString().slice(0, 16)
      : ""
  );
  const [visitType, setVisitType] = useState(visit?.visitType ?? "PREVENTIVE");
  const [status, setStatus] = useState(visit?.status ?? "SCHEDULED");
  const [reportedIssue, setReportedIssue] = useState(visit?.reportedIssue ?? "");
  const [servicePerformed, setServicePerformed] = useState(visit?.servicePerformed ?? "");
  const [technicalNotes, setTechnicalNotes] = useState(visit?.technicalNotes ?? "");
  const [requiresReturn, setRequiresReturn] = useState(visit?.requiresReturn ?? false);
  const [returnDueDate, setReturnDueDate] = useState(
    visit?.returnDueDate
      ? new Date(visit.returnDueDate).toISOString().slice(0, 16)
      : ""
  );

  const selectedEquipment = useMemo(() => {
    return equipment.find((item) => item.id === equipmentId);
  }, [equipment, equipmentId]);

  function handleSubmit(formData: FormData) {
    setError("");

    const payload = {
      equipmentId: String(formData.get("equipmentId") ?? ""),
      technicianId: String(formData.get("technicianId") ?? ""),
      scheduledAt: String(formData.get("scheduledAt") ?? ""),
      startedAt: String(formData.get("startedAt") ?? ""),
      finishedAt: String(formData.get("finishedAt") ?? ""),
      visitType: String(formData.get("visitType") ?? "PREVENTIVE") as
        | "PREVENTIVE"
        | "CORRECTIVE"
        | "INSTALLATION"
        | "REPLACEMENT"
        | "REMOVAL"
        | "INSPECTION",
      status: String(formData.get("status") ?? "SCHEDULED") as
        | "SCHEDULED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELED"
        | "PENDING_RETURN",
      reportedIssue: String(formData.get("reportedIssue") ?? ""),
      servicePerformed: String(formData.get("servicePerformed") ?? ""),
      technicalNotes: String(formData.get("technicalNotes") ?? ""),
      requiresReturn: formData.get("requiresReturn") === "on",
      returnDueDate: String(formData.get("returnDueDate") ?? ""),
    };

    startTransition(async () => {
      try {
        if (visit) {
          await updateVisit(visit.id, payload);
        } else {
          await createVisit(payload);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar visita.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Equipamento
          </label>
          <select
            name="equipmentId"
            value={equipmentId}
            onChange={(e) => setEquipmentId(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            required
          >
            <option value="">Selecione</option>
            {equipment.map((item) => (
              <option key={item.id} value={item.id}>
                {(item.customer.tradeName || item.customer.legalName) + " • " + item.unit.name + " • " + item.equipmentType + (item.assetTag ? ` • ${item.assetTag}` : "")}
              </option>
            ))}
          </select>
        </div>

        {selectedEquipment ? (
          <div className="md:col-span-2 rounded-xl border bg-slate-50 p-4 text-sm text-slate-600">
            <div>
              <strong className="text-slate-900">Cliente:</strong>{" "}
              {selectedEquipment.customer.tradeName || selectedEquipment.customer.legalName}
            </div>
            <div>
              <strong className="text-slate-900">Unidade:</strong>{" "}
              {selectedEquipment.unit.name}
            </div>
            <div>
              <strong className="text-slate-900">Equipamento:</strong>{" "}
              {selectedEquipment.equipmentType}
            </div>
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Técnico
          </label>
          <select
            name="technicianId"
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="">Selecione</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tipo de visita
          </label>
          <select
            name="visitType"
            value={visitType}
            onChange={(e) => setVisitType(e.target.value as typeof visitType)}
            className="w-full rounded-xl border px-3 py-2"
          >
            {visitTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Data agendada
          </label>
          <input
            name="scheduledAt"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Início
          </label>
          <input
            name="startedAt"
            type="datetime-local"
            value={startedAt}
            onChange={(e) => setStartedAt(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Fim
          </label>
          <input
            name="finishedAt"
            type="datetime-local"
            value={finishedAt}
            onChange={(e) => setFinishedAt(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="w-full rounded-xl border px-3 py-2"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-7">
          <input
            id="requiresReturn"
            name="requiresReturn"
            type="checkbox"
            checked={requiresReturn}
            onChange={(e) => setRequiresReturn(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="requiresReturn" className="text-sm font-medium text-slate-700">
            Precisa retorno
          </label>
        </div>

        {requiresReturn ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Data do retorno
            </label>
            <input
              name="returnDueDate"
              type="datetime-local"
              value={returnDueDate}
              onChange={(e) => setReturnDueDate(e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Problema relatado
        </label>
        <textarea
          name="reportedIssue"
          value={reportedIssue}
          onChange={(e) => setReportedIssue(e.target.value)}
          className="min-h-25 w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Serviço executado
        </label>
        <textarea
          name="servicePerformed"
          value={servicePerformed}
          onChange={(e) => setServicePerformed(e.target.value)}
          className="min-h-25 w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Observações técnicas
        </label>
        <textarea
          name="technicalNotes"
          value={technicalNotes}
          onChange={(e) => setTechnicalNotes(e.target.value)}
          className="min-h-25 w-full rounded-xl border px-3 py-2"
        />
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isPending ? "Salvando..." : visit ? "Salvar alterações" : "Cadastrar visita"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/visits")}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}