"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Customer } from "@prisma/client";
import { createCustomer, updateCustomer } from "@/server/actions/customer-action";
import { customerSchema, type CustomerInput } from "@/lib/validations/customer";
import { toast } from "sonner";
import { FormInput } from "./form-input";
import { FormCheckbox } from "./form-checkbox";
import { FormTextarea } from "./form-textarea";
import { maskCpfCnpj, maskPhone } from "@/lib/utils";

type CustomerFormProps = {
  customer?: Customer | null;
};

export function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      legalName: customer?.legalName ?? "",
      tradeName: customer?.tradeName ?? "",
      document: customer?.document ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
      notes: customer?.notes ?? "",
      isActive: customer?.isActive ?? true,
    },
  });

  async function onSubmit(data: CustomerInput) {
    try {
      if (customer) {
        await updateCustomer(customer.id, data);
        toast.success("Cliente atualizado com sucesso");
      } else {
        await createCustomer(data);
        toast.success("Cliente cadastrado com sucesso");
      }
      router.push("/customers");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar cliente"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          {...register("legalName")}
          label="Razão social / Nome"
          placeholder="Ex.: Hospital Santa Helena LTDA"
          required
          error={errors.legalName?.message}
        />

        <FormInput
          {...register("tradeName")}
          label="Nome fantasia"
          placeholder="Ex.: Hospital Santa Helena"
          error={errors.tradeName?.message}
        />

        <FormInput
          label="Documento"
          placeholder="CNPJ / CPF"
          error={errors.document?.message}
          {...register("document", {
            onChange: (e) => {
              e.target.value = maskCpfCnpj(e.target.value);
            },
          })}
        />

        <FormInput
          {...register("email")}
          type="email"
          label="E-mail"
          placeholder="contato@empresa.com"
          error={errors.email?.message}
        />

        <FormInput
          label="Telefone"
          placeholder="(62) 99999-9999"
          error={errors.phone?.message}
          {...register("phone", {
            onChange: (e) => {
              e.target.value = maskPhone(e.target.value);
            },
          })}
        />

        <div className="md:col-span-2">
          <FormCheckbox
            {...register("isActive")}
            id="isActive"
            label="Cliente ativo"
            error={errors.isActive?.message}
          />
        </div>
      </div>

      <FormTextarea
        {...register("notes")}
        label="Observações"
        placeholder="Observações gerais do cliente"
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
            : customer
              ? "Salvar alterações"
              : "Cadastrar cliente"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/customers")}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}