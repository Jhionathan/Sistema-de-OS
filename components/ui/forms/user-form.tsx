"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser, updateUser } from "@/server/actions/user-action";
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput } from "@/lib/validations/user";
import { toast } from "sonner";
import { FormInput } from "./form-input";
import { FormSelect } from "./form-select";
import { FormCheckbox } from "./form-checkbox";
import { ShieldCheck, Building2 } from "lucide-react";

type UserFormProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
  customers: { id: string; legalName: string; tradeName: string | null }[];
  units: { id: string; name: string; customerId: string }[];
};

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Administrador" },
  { value: "MANAGER", label: "Gestor" },
  { value: "TECHNICIAN", label: "Técnico" },
  { value: "CUSTOMER", label: "Cliente" },
];

export function UserForm({ user, customers, units }: UserFormProps) {
  const router = useRouter();
  
  const isEditing = !!user;
  const Schema = isEditing ? updateUserSchema : createUserSchema;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput | UpdateUserInput>({
    resolver: zodResolver(Schema) as any,
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "TECHNICIAN",
      password: "",
      isActive: user?.isActive ?? true,
      customerId: user?.customerId ?? "",
      unitId: user?.unitId ?? "",
    } as any,
  });

  const selectedRole = watch("role");
  const selectedCustomerId = watch("customerId");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: any) {
    try {
      if (isEditing) {
        await updateUser(user.id, data);
        toast.success("Usuário atualizado com sucesso");
      } else {
        await createUser(data);
        toast.success("Usuário criado com sucesso");
      }
      router.push("/users");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar usuário"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Credenciais</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              {...register("name")}
              label="Nome Completo"
              placeholder="Ex.: João Silva"
              required
              error={errors.name?.message as string | undefined}
            />

            <FormInput
              {...register("email")}
              type="email"
              label="E-mail de acesso"
              placeholder="joao@empresa.com"
              required
              error={errors.email?.message as string | undefined}
            />

            <FormSelect
              {...register("role")}
              label="Perfil de Acesso"
              options={ROLE_OPTIONS}
              error={errors.role?.message as string | undefined}
            />

            <div className="relative">
              <FormInput
                {...register("password")}
                type="password"
                label={isEditing ? "Nova Senha (opcional)" : "Senha de Acesso"}
                placeholder="••••••••"
                required={!isEditing}
                error={errors.password?.message as string | undefined}
              />
            </div>
          </div>
        </div>

        {selectedRole === "CUSTOMER" && (
          <div className="space-y-4 md:col-span-2 border-t border-border pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Vincular Empresa</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormSelect
                {...register("customerId")}
                label="Cliente / Empresa"
                options={[
                  { value: "", label: "Selecione uma empresa..." },
                  ...customers.map((c) => ({
                    value: c.id,
                    label: c.tradeName || c.legalName,
                  })),
                ]}
                error={errors.customerId?.message as string | undefined}
              />

              <FormSelect
                {...register("unitId")}
                label="Unidade (Opcional)"
                options={[
                  { value: "", label: "Todas as unidades" },
                  ...units
                    .filter((u) => u.customerId === selectedCustomerId)
                    .map((u) => ({
                      value: u.id,
                      label: u.name,
                    })),
                ]}
                error={errors.unitId?.message as string | undefined}
                disabled={!selectedCustomerId}
              />
            </div>
          </div>
        )}

        <div className="md:col-span-2 rounded-xl border border-border bg-card p-4">
          <FormCheckbox
            {...register("isActive")}
            id="isActive"
            label="Usuário ativo para acessar o sistema"
            error={errors.isActive?.message as string | undefined}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-all shadow-sm"
        >
          {isSubmitting
            ? "Salvando..."
            : isEditing
              ? "Salvar alterações"
              : "Cadastrar usuário"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/users")}
          className="rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
