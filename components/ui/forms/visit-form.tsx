"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Equipment, Technician, Visit, Customer, CustomerUnit } from "@prisma/client";
import { createVisit, updateVisit } from "@/server/actions/visit-action";
import { visitSchema, type VisitInput } from "@/lib/validations/visit";
import { toast } from "sonner";
import { FormInput } from "./form-input";
import { FormSelect } from "./form-select";
import { FormTextarea } from "./form-textarea";
import { FormCheckbox } from "./form-checkbox";

type EquipmentOption = Equipment & {
  customer: Customer;
  unit: CustomerUnit;
};

type VisitFormProps = {
  visit?: Visit | null;
  equipment: EquipmentOption[];
  technicians: Technician[];
};

const VISIT_TYPE_OPTIONS = [
  { value: "PREVENTIVE", label: "Preventiva" },
  { value: "CORRECTIVE", label: "Corretiva" },
  { value: "INSTALLATION", label: "Instalação" },
  { value: "REPLACEMENT", label: "Troca" },
  { value: "REMOVAL", label: "Retirada" },
  { value: "INSPECTION", label: "Inspeção" },
];

const STATUS_OPTIONS = [
  { value: "SCHEDULED", label: "Agendada" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "COMPLETED", label: "Concluída" },
  { value: "CANCELED", label: "Cancelada" },
  { value: "PENDING_RETURN", label: "Pendente retorno" },
];

const TECHNICIAN_OPTIONS = (technicians: Technician[]) =>
  technicians.map((tech) => ({ value: tech.id, label: tech.name }));

const EQUIPMENT_OPTIONS = (equipment: EquipmentOption[]) =>
  equipment.map((item) => ({
    value: item.id,
    label: `${item.customer.tradeName || item.customer.legalName} • ${item.unit.name} • ${item.equipmentType}${
      item.assetTag ? ` • ${item.assetTag}` : ""
    }`,
  }));

function formatDateTimeForInput(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
}

export function VisitForm({ visit, equipment, technicians }: VisitFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<VisitInput>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      equipmentId: visit?.equipmentId ?? "",
      technicianId: visit?.technicianId ?? "",
      scheduledAt: formatDateTimeForInput(visit?.scheduledAt),
      startedAt: formatDateTimeForInput(visit?.startedAt),
      finishedAt: formatDateTimeForInput(visit?.finishedAt),
      visitType: visit?.visitType ?? "PREVENTIVE",
      status: visit?.status ?? "SCHEDULED",
      reportedIssue: visit?.reportedIssue ?? "",
      servicePerformed: visit?.servicePerformed ?? "",
      technicalNotes: visit?.technicalNotes ?? "",
      requiresReturn: visit?.requiresReturn ?? false,
      returnDueDate: formatDateTimeForInput(visit?.returnDueDate),
    },
  });

  const equipmentId = watch("equipmentId");
  const requiresReturn = watch("requiresReturn");

  const selectedEquipment = useMemo(() => {
    return equipment.find((item) => item.id === equipmentId);
  }, [equipment, equipmentId]);

  async function onSubmit(data: VisitInput) {
    try {
      if (visit) {
        await updateVisit(visit.id, data);
        toast.success("Visita atualizada com sucesso");
      } else {
        await createVisit(data);
        toast.success("Visita criada com sucesso");
      }
      router.push("/visits");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar visita"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <FormSelect
            {...register("equipmentId")}
            label="Equipamento"
            options={EQUIPMENT_OPTIONS(equipment)}
            placeholder="Selecione um equipamento"
            error={errors.equipmentId?.message}
            required
          />
        </div>

        {selectedEquipment && (
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div>
              <strong className="text-slate-900">Cliente:</strong>{" "}
              {selectedEquipment.customer.tradeName ||
                selectedEquipment.customer.legalName}
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
        )}

        <FormSelect
          {...register("technicianId")}
          label="Técnico"
          options={TECHNICIAN_OPTIONS(technicians)}
          placeholder="Selecione (opcional)"
          error={errors.technicianId?.message}
        />

        <FormSelect
          {...register("visitType")}
          label="Tipo de visita"
          options={VISIT_TYPE_OPTIONS}
          error={errors.visitType?.message}
        />

        <FormInput
          {...register("scheduledAt")}
          type="datetime-local"
          label="Data agendada"
          error={errors.scheduledAt?.message}
          required
        />

        <FormInput
          {...register("startedAt")}
          type="datetime-local"
          label="Início"
          error={errors.startedAt?.message}
        />

        <FormInput
          {...register("finishedAt")}
          type="datetime-local"
          label="Fim"
          error={errors.finishedAt?.message}
        />

        <FormSelect
          {...register("status")}
          label="Status"
          options={STATUS_OPTIONS}
          error={errors.status?.message}
        />

        <div className="md:col-span-2">
          <FormCheckbox
            {...register("requiresReturn")}
            id="requiresReturn"
            label="Precisa retorno"
            error={errors.requiresReturn?.message}
          />
        </div>

        {requiresReturn && (
          <FormInput
            {...register("returnDueDate")}
            type="datetime-local"
            label="Data do retorno"
            error={errors.returnDueDate?.message}
          />
        )}
      </div>

      <FormTextarea
        {...register("reportedIssue")}
        label="Problema relatado"
        placeholder="Descreva o problema identificado"
        className="min-h-24"
        error={errors.reportedIssue?.message}
      />

      <FormTextarea
        {...register("servicePerformed")}
        label="Serviço executado"
        placeholder="Descreva o serviço realizado"
        className="min-h-24"
        error={errors.servicePerformed?.message}
      />

      <FormTextarea
        {...register("technicalNotes")}
        label="Observações técnicas"
        placeholder="Adicione observações técnicas relevantes"
        className="min-h-24"
        error={errors.technicalNotes?.message}
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition-colors"
        >
          {isSubmitting
            ? "Salvando..."
            : visit
              ? "Salvar alterações"
              : "Cadastrar visita"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/visits")}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}