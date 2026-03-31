"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Customer, CustomerUnit } from "@prisma/client";
import { createUnit, updateUnit } from "@/server/actions/unit-action";
import { unitSchema, type UnitInput } from "@/lib/validations/units";
import { toast } from "sonner";
import { FormInput } from "./form-input";
import { FormSelect } from "./form-select";
import { FormCheckbox } from "./form-checkbox";
import { FormTextarea } from "./form-textarea";

type UnitFormProps = {
  unit?: CustomerUnit | null;
  customers: Pick<Customer, "id" | "legalName" | "tradeName">[];
};

const CUSTOMER_OPTIONS = (customers: Pick<Customer, "id" | "legalName" | "tradeName">[]) =>
  customers.map((customer) => ({
    value: customer.id,
    label: customer.tradeName || customer.legalName,
  }));

export function UnitForm({ unit, customers }: UnitFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UnitInput>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      customerId: unit?.customerId ?? "",
      name: unit?.name ?? "",
      contactName: unit?.contactName ?? "",
      contactPhone: unit?.contactPhone ?? "",
      street: unit?.street ?? "",
      number: unit?.number ?? "",
      district: unit?.district ?? "",
      city: unit?.city ?? "",
      state: unit?.state ?? "",
      zipCode: unit?.zipCode ?? "",
      notes: unit?.notes ?? "",
      isActive: unit?.isActive ?? true,
    },
  });

  async function onSubmit(data: UnitInput) {
    try {
      if (unit) {
        await updateUnit(unit.id, data);
        toast.success("Unidade atualizada com sucesso");
      } else {
        await createUnit(data);
        toast.success("Unidade cadastrada com sucesso");
      }
      router.push("/units");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar unidade"
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

        <FormInput
          {...register("name")}
          label="Nome da unidade"
          placeholder="Ex.: Unidade Centro"
          required
          error={errors.name?.message}
        />

        <FormInput
          {...register("contactName")}
          label="Responsável"
          placeholder="Nome do responsável"
          error={errors.contactName?.message}
        />

        <FormInput
          {...register("contactPhone")}
          label="Telefone do responsável"
          placeholder="(62) 99999-9999"
          error={errors.contactPhone?.message}
        />

        <FormInput
          {...register("street")}
          label="Rua"
          error={errors.street?.message}
        />

        <FormInput
          {...register("number")}
          label="Número"
          error={errors.number?.message}
        />

        <FormInput
          {...register("district")}
          label="Bairro"
          error={errors.district?.message}
        />

        <FormInput
          {...register("zipCode")}
          label="CEP"
          error={errors.zipCode?.message}
        />

        <FormInput
          {...register("city")}
          label="Cidade"
          error={errors.city?.message}
        />

        <FormInput
          {...register("state")}
          label="Estado"
          placeholder="GO"
          error={errors.state?.message}
        />

        <div className="md:col-span-2">
          <FormCheckbox
            {...register("isActive")}
            id="isActive"
            label="Unidade ativa"
            error={errors.isActive?.message}
          />
        </div>
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
          {isSubmitting ? "Salvando..." : unit ? "Salvar alterações" : "Cadastrar unidade"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/units")}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}