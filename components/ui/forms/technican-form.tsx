"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Technician } from "@prisma/client";
import {
  createTechnician,
  updateTechnician,
} from "@/server/actions/technician-action";
import { technicianSchema, type TechnicianInput } from "@/lib/validations/technician";
import { toast } from "sonner";
import { FormInput } from "./form-input";
import { FormCheckbox } from "./form-checkbox";

type TechnicianFormProps = {
  technician?: Technician | null;
};

export function TechnicianForm({ technician }: TechnicianFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TechnicianInput>({
    resolver: zodResolver(technicianSchema),
    defaultValues: {
      name: technician?.name ?? "",
      email: technician?.email ?? "",
      phone: technician?.phone ?? "",
      isActive: technician?.isActive ?? true,
    },
  });

  async function onSubmit(data: TechnicianInput) {
    try {
      if (technician) {
        await updateTechnician(technician.id, data);
        toast.success("Técnico atualizado com sucesso");
      } else {
        await createTechnician(data);
        toast.success("Técnico cadastrado com sucesso");
      }
      router.push("/technicians");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar técnico"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          {...register("name")}
          label="Nome"
          placeholder="Ex.: Carlos Técnico"
          required
          error={errors.name?.message}
        />

        <FormInput
          {...register("email")}
          type="email"
          label="E-mail"
          placeholder="tecnico@empresa.com"
          error={errors.email?.message}
        />

        <FormInput
          {...register("phone")}
          label="Telefone"
          placeholder="(62) 99999-9999"
          error={errors.phone?.message}
        />

        <div className="md:col-span-2">
          <FormCheckbox
            {...register("isActive")}
            id="isActive"
            label="Técnico ativo"
            error={errors.isActive?.message}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition-colors"
        >
          {isSubmitting
            ? "Salvando..."
            : technician
              ? "Salvar alterações"
              : "Cadastrar técnico"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/technicians")}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}