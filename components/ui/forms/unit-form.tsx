"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Customer, CustomerUnit } from "@prisma/client";
import { createUnit, updateUnit } from "@/server/actions/unit-action";

type UnitFormProps = {
  unit?: CustomerUnit | null;
  customers: Pick<Customer, "id" | "legalName" | "tradeName">[];
};

export function UnitForm({ unit, customers }: UnitFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [customerId, setCustomerId] = useState(unit?.customerId ?? "");
  const [name, setName] = useState(unit?.name ?? "");
  const [contactName, setContactName] = useState(unit?.contactName ?? "");
  const [contactPhone, setContactPhone] = useState(unit?.contactPhone ?? "");
  const [street, setStreet] = useState(unit?.street ?? "");
  const [number, setNumber] = useState(unit?.number ?? "");
  const [district, setDistrict] = useState(unit?.district ?? "");
  const [city, setCity] = useState(unit?.city ?? "");
  const [state, setState] = useState(unit?.state ?? "");
  const [zipCode, setZipCode] = useState(unit?.zipCode ?? "");
  const [notes, setNotes] = useState(unit?.notes ?? "");
  const [isActive, setIsActive] = useState(unit?.isActive ?? true);

  function handleSubmit(formData: FormData) {
    setError("");

    const payload = {
      customerId: String(formData.get("customerId") ?? ""),
      name: String(formData.get("name") ?? ""),
      contactName: String(formData.get("contactName") ?? ""),
      contactPhone: String(formData.get("contactPhone") ?? ""),
      street: String(formData.get("street") ?? ""),
      number: String(formData.get("number") ?? ""),
      district: String(formData.get("district") ?? ""),
      city: String(formData.get("city") ?? ""),
      state: String(formData.get("state") ?? ""),
      zipCode: String(formData.get("zipCode") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      isActive: formData.get("isActive") === "on",
    };

    startTransition(async () => {
      try {
        if (unit) {
          await updateUnit(unit.id, payload);
        } else {
          await createUnit(payload);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar unidade.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Cliente
          </label>
          <select
            name="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            required
          >
            <option value="">Selecione</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.tradeName || customer.legalName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nome da unidade
          </label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Ex.: Unidade Centro"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Responsável
          </label>
          <input
            name="contactName"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Nome do responsável"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Telefone do responsável
          </label>
          <input
            name="contactPhone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="(62) 99999-9999"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Rua
          </label>
          <input
            name="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Número
          </label>
          <input
            name="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Bairro
          </label>
          <input
            name="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            CEP
          </label>
          <input
            name="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Cidade
          </label>
          <input
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Estado
          </label>
          <input
            name="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="GO"
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
            Unidade ativa
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
          {isPending ? "Salvando..." : unit ? "Salvar alterações" : "Cadastrar unidade"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/units")}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}