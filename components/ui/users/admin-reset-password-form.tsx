"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { adminResetPassword } from "@/server/actions/user-action";

const schema = z
  .object({
    newPassword: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a senha"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function AdminResetPasswordForm({ userId }: { userId: string }) {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await adminResetPassword(userId, data.newPassword);
      toast.success("Senha redefinida com sucesso.");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao redefinir senha.");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Redefinir senha</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Defina uma nova senha para este usuário. Ele precisará usá-la no próximo login.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* New password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Nova senha <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                {...register("newPassword")}
                type={showNew ? "text" : "password"}
                placeholder="••••••••"
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Confirmar nova senha <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-all shadow-sm"
          >
            {isSubmitting ? "Salvando..." : "Redefinir senha"}
          </button>
        </div>
      </form>
    </div>
  );
}
