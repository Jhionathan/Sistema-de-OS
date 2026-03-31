"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Customer, CustomerUnit, Equipment } from "@prisma/client";
import {
  createEquipment,
  updateEquipment,
} from "@/server/actions/equipment-action";
import { equipmentSchema, type EquipmentInput } from "@/lib/validations/equipment";
import { toast } from "sonner";
import { FormInput } from "./form-input";
import { FormSelect } from "./form-select";
import { FormTextarea } from "./form-textarea";

type EquipmentFormProps = {
  equipment?: Equipment | null;
  customers: Pick<Customer, "id" | "legalName" | "tradeName">[];
  units: Pick<CustomerUnit, "id" | "name" | "customerId">[];
};

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "IN_MAINTENANCE", label: "Em manutenção" },
  { value: "REMOVED", label: "Retirado" },
  { value: "REPLACED", label: "Substituído" },
  { value: "INACTIVE", label: "Inativo" },
];

const CUSTOMER_OPTIONS = (customers: Pick<Customer, "id" | "legalName" | "tradeName">[]) =>
  customers.map((customer) => ({
    value: customer.id,
    label: customer.tradeName || customer.legalName,
  }));

const UNIT_OPTIONS = (units: Pick<CustomerUnit, "id" | "name" | "customerId">[]) =>
  units.map((unit) => ({
    value: unit.id,
    label: unit.name,
  }));

function formatDateForInput(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function EquipmentForm({
  equipment,
  customers,
  units,
}: EquipmentFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EquipmentInput>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      customerId: equipment?.customerId ?? "",
      unitId: equipment?.unitId ?? "",
      equipmentType: equipment?.equipmentType ?? "",
      brand: equipment?.brand ?? "",
      model: equipment?.model ?? "",
      assetTag: equipment?.assetTag ?? "",
      serialNumber: equipment?.serialNumber ?? "",
      installationDate: formatDateForInput(equipment?.installationDate),
      maintenanceFrequencyDays: equipment?.maintenanceFrequencyDays?.toString() ?? "",
      status: equipment?.status ?? "ACTIVE",
      notes: equipment?.notes ?? "",
    },
  });

  const customerId = watch("customerId");

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => unit.customerId === customerId);
  }, [units, customerId]);

  async function onSubmit(data: EquipmentInput) {
    try {
      if (equipment) {
        await updateEquipment(equipment.id, data);
        toast.success("Equipamento atualizado com sucesso");
      } else {
        await createEquipment(data);
        toast.success("Equipamento cadastrado com sucesso");
      }
      router.push("/equipment");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar equipamento"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormSelect
          {...register("customerId")}
          label="Cliente"
          options={CUSTOMER_OPTIONS(customers)}
          placeholder="Selecione um cliente"
          required
          error={errors.customerId?.message}
        />

        <FormSelect
          {...register("unitId")}
          label="Unidade"
          options={UNIT_OPTIONS(filteredUnits)}
          placeholder="Selecione uma unidade"
          required
          error={errors.unitId?.message}
        />

        <FormInput
          {...register("equipmentType")}
          label="Tipo de equipamento"
          placeholder="Ex.: Dispenser de Sabonete"
          required
          error={errors.equipmentType?.message}
        />

        <FormInput
          {...register("brand")}
          label="Marca"
          placeholder="Ex.: Higitech"
          error={errors.brand?.message}
        />

        <FormInput
          {...register("model")}
          label="Modelo"
          error={errors.model?.message}
        />

        <FormInput
          {...register("assetTag")}
          label="Patrimônio / Tag"
          placeholder="Ex.: EQ-001"
          error={errors.assetTag?.message}
        />

        <FormInput
          {...register("serialNumber")}
          label="Número de série"
          error={errors.serialNumber?.message}
        />

        <FormInput
          {...register("installationDate")}
          type="date"
          label="Data de instalação"
          error={errors.installationDate?.message}
        />

        <FormInput
          {...register("maintenanceFrequencyDays")}
          type="number"
          label="Frequência de manutenção (dias)"
          placeholder="30"
          error={errors.maintenanceFrequencyDays?.message}
        />

        <FormSelect
          {...register("status")}
          label="Status"
          options={STATUS_OPTIONS}
          error={errors.status?.message}
        />
      </div>

      <FormTextarea
        {...register("notes")}
        label="Observações"
        className="min-h-24"
        error={errors.notes?.message}
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition-colors"
        >
          {isSubmitting
            ? "Salvando..."
            : equipment
              ? "Salvar alterações"
              : "Cadastrar equipamento"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/equipment")}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}