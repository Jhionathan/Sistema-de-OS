"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Customer } from "@prisma/client";
import { createCustomer, updateCustomer } from "@/server/actions/customer-action";

type CustomerFormProps = {
  customer?: Customer | null;
};

export function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [legalName, setLegalName] = useState(customer?.legalName ?? "");
  const [tradeName, setTradeName] = useState(customer?.tradeName ?? "");
  const [document, setDocument] = useState(customer?.document ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [notes, setNotes] = useState(customer?.notes ?? "");
  const [isActive, setIsActive] = useState(customer?.isActive ?? true);

  function handleSubmit(formData: FormData) {
    setError("");

    const payload = {
      legalName: String(formData.get("legalName") ?? ""),
      tradeName: String(formData.get("tradeName") ?? ""),
      document: String(formData.get("document") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      isActive: formData.get("isActive") === "on",
    };

    startTransition(async () => {
      try {
        if (customer) {
          await updateCustomer(customer.id, payload);
        } else {
          await createCustomer(payload);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar cliente.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Razão social / Nome
          </label>
          <input
            name="legalName"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Ex.: Hospital Santa Helena LTDA"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nome fantasia
          </label>
          <input
            name="tradeName"
            value={tradeName}
            onChange={(e) => setTradeName(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Ex.: Hospital Santa Helena"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Documento
          </label>
          <input
            name="document"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="CNPJ / CPF"
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
            placeholder="contato@empresa.com"
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
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
            Cliente ativo
          </label>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Observações
        </label>
        <textarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-30 w-full rounded-xl border px-3 py-2"
          placeholder="Observações gerais do cliente"
        />
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
          {isPending ? "Salvando..." : customer ? "Salvar alterações" : "Cadastrar cliente"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/customers")}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}