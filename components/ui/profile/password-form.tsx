"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validations/user";
import { updateOwnPassword } from "@/server/actions/user-action";
import { toast } from "sonner";
import { Loader2, KeyRound, Eye, EyeOff } from "lucide-react";

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(data: ChangePasswordInput) {
    setIsLoading(true);
    try {
      await updateOwnPassword(data);
      toast.success("Sua senha foi alterada com sucesso!");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao alterar senha.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground font-heading">Alterar Senha</h2>
          <p className="text-xs text-muted-foreground">Atualize suas credenciais de acesso.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Senha Atual */}
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Senha atual</label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                {...register("currentPassword")}
                className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs font-medium text-red-500">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* Nova Senha */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nova senha</label>
            <input
              type={showPasswords ? "text" : "password"}
              {...register("newPassword")}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              placeholder="Novos 6+ caracteres"
            />
            {errors.newPassword && (
              <p className="text-xs font-medium text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Confirmar nova senha</label>
            <input
              type={showPasswords ? "text" : "password"}
              {...register("confirmPassword")}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              placeholder="Repita a nova senha"
            />
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center h-11 rounded-xl bg-primary px-4 text-sm font-bold text-white transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 disabled:opacity-50 shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Salvar nova senha"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
