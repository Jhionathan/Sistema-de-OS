"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Technician } from "@prisma/client";
import {
  createTechnician,
  updateTechnician,
} from "@/server/actions/technician-action";

type TechnicianFormProps = {
  technician?: Technician | null;
};

export function TechnicianForm({ technician }: TechnicianFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [name, setName] = useState(technician?.name ?? "");
  const [email, setEmail] = useState(technician?.email ?? "");
  const [phone, setPhone] = useState(technician?.phone ?? "");
  const [isActive, setIsActive] = useState(technician?.isActive ?? true);

  function handleSubmit(formData: FormData) {
    setError("");

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      isActive: formData.get("isActive") === "on",
    };

    startTransition(async () => {
      try {
        if (technician) {
          await updateTechnician(technician.id, payload);
        } else {
          await createTechnician(payload);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar técnico.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nome
          </label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Ex.: Carlos Técnico"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            E-mail
          </label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="tecnico@empresa.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Telefone
          </label>
          <input
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="(62) 99999-9999"
          />
        </div>

        <div className="flex items-center gap-3 pt-7">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-slate-700"
          >
            Técnico ativo
          </label>
        </div>
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
          {isPending
            ? "Salvando..."
            : technician
              ? "Salvar alterações"
              : "Cadastrar técnico"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/technicians")}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}