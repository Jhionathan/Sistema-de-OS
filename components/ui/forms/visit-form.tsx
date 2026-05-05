"use client";

import { useMemo, useState, useEffect } from "react";
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

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
  { value: "URGENT", label: "Urgente" },
];

const STATUS_OPTIONS = [
  { value: "REQUESTED", label: "Aberto (Triagem)" },
  { value: "SCHEDULED", label: "Agendada" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "COMPLETED", label: "Concluída" },
  { value: "CANCELED", label: "Cancelada" },
  { value: "PENDING_RETURN", label: "Pendente retorno" },
];

const TECHNICIAN_OPTIONS = (technicians: Technician[]) =>
  technicians.map((tech) => ({ value: tech.id, label: tech.name }));



function formatDateTimeForInput(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
}

export function VisitForm({ visit, equipment, technicians }: VisitFormProps) {
  const router = useRouter();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");

  useEffect(() => {
    if (visit?.equipmentId) {
      const eq = equipment.find((e) => e.id === visit.equipmentId);
      if (eq) {
        setSelectedCustomerId(eq.customerId);
        setSelectedUnitId(eq.unitId);
      }
    }
  }, [visit, equipment]);

  const {
    register,
    handleSubmit,
    setValue,
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
      visitType: (visit?.visitType as VisitInput["visitType"]) ?? "PREVENTIVE",
      status: (visit?.status as VisitInput["status"]) ?? "SCHEDULED",
      priority: (visit?.priority as VisitInput["priority"]) ?? "MEDIUM",
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

  const { customers, units, filteredEquipment } = useMemo(() => {
    const custMap = new Map<string, { value: string; label: string }>();
    const unitMap = new Map<string, { value: string; label: string }>();
    const equipList: { value: string; label: string }[] = [];

    equipment.forEach((item) => {
      // populate customers map
      if (!custMap.has(item.customer.id)) {
        custMap.set(item.customer.id, {
          value: item.customer.id,
          label: item.customer.tradeName || item.customer.legalName,
        });
      }

      const matchesCustomer = !selectedCustomerId || item.customerId === selectedCustomerId;

      if (matchesCustomer && !unitMap.has(item.unit.id)) {
        unitMap.set(item.unit.id, {
          value: item.unit.id,
          label: item.unit.name,
        });
      }

      const matchesUnit = !selectedUnitId || item.unitId === selectedUnitId;

      if (matchesCustomer && matchesUnit) {
        equipList.push({
          value: item.id,
          label: `${item.equipmentType}${item.assetTag ? ` • ${item.assetTag}` : ""}`,
        });
      }
    });

    return {
      customers: Array.from(custMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
      units: Array.from(unitMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
      filteredEquipment: equipList.sort((a, b) => a.label.localeCompare(b.label)),
    };
  }, [equipment, selectedCustomerId, selectedUnitId]);

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
        <div className="md:col-span-2 grid gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:grid-cols-3">
          <FormSelect
            label="1. Cliente (Filtro)"
            options={customers}
            value={selectedCustomerId}
            onChange={(e) => {
              setSelectedCustomerId(e.target.value);
              setSelectedUnitId("");
              setValue("equipmentId", "");
            }}
            placeholder="Todos os clientes"
            name="customerFilter"
          />

          <FormSelect
            label="2. Unidade (Filtro)"
            options={units}
            value={selectedUnitId}
            onChange={(e) => {
              setSelectedUnitId(e.target.value);
              setValue("equipmentId", "");
            }}
            placeholder={selectedCustomerId ? "Todas as unidades" : "Selecione o cliente"}
            disabled={!selectedCustomerId || units.length === 0}
            name="unitFilter"
          />

          <FormSelect
            {...register("equipmentId", {
              onChange: (e) => {
                const eq = equipment.find(x => x.id === e.target.value);
                if (eq) {
                   if (!selectedCustomerId) setSelectedCustomerId(eq.customerId);
                   if (!selectedUnitId) setSelectedUnitId(eq.unitId);
                }
              }
            })}
            label="3. Equipamento *"
            options={filteredEquipment}
            placeholder={filteredEquipment.length > 0 ? "Selecione o equipamento" : "Nenhum disponível"}
            error={errors.equipmentId?.message}
            disabled={filteredEquipment.length === 0}
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

        <FormSelect
          {...register("priority")}
          label="Prioridade"
          options={PRIORITY_OPTIONS}
          error={errors.priority?.message}
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