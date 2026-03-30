"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Customer, CustomerUnit, Equipment } from "@prisma/client";
import {
  createEquipment,
  updateEquipment,
} from "@/server/actions/equipment-action";

type EquipmentFormProps = {
  equipment?: Equipment | null;
  customers: Pick<Customer, "id" | "legalName" | "tradeName">[];
  units: Pick<CustomerUnit, "id" | "name" | "customerId">[];
};

const statusOptions = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "IN_MAINTENANCE", label: "Em manutenção" },
  { value: "REMOVED", label: "Retirado" },
  { value: "REPLACED", label: "Substituído" },
  { value: "INACTIVE", label: "Inativo" },
] as const;

export function EquipmentForm({
  equipment,
  customers,
  units,
}: EquipmentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [customerId, setCustomerId] = useState(equipment?.customerId ?? "");
  const [unitId, setUnitId] = useState(equipment?.unitId ?? "");
  const [equipmentType, setEquipmentType] = useState(
    equipment?.equipmentType ?? ""
  );
  const [brand, setBrand] = useState(equipment?.brand ?? "");
  const [model, setModel] = useState(equipment?.model ?? "");
  const [assetTag, setAssetTag] = useState(equipment?.assetTag ?? "");
  const [serialNumber, setSerialNumber] = useState(equipment?.serialNumber ?? "");
  const [installationDate, setInstallationDate] = useState(
    equipment?.installationDate
      ? new Date(equipment.installationDate).toISOString().split("T")[0]
      : ""
  );
  const [maintenanceFrequencyDays, setMaintenanceFrequencyDays] = useState(
    equipment?.maintenanceFrequencyDays?.toString() ?? ""
  );
  const [status, setStatus] = useState(equipment?.status ?? "ACTIVE");
  const [notes, setNotes] = useState(equipment?.notes ?? "");

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => unit.customerId === customerId);
  }, [units, customerId]);

  function handleCustomerChange(value: string) {
    setCustomerId(value);
    setUnitId("");
  }

  function handleSubmit(formData: FormData) {
    setError("");

    const payload = {
      customerId: String(formData.get("customerId") ?? ""),
      unitId: String(formData.get("unitId") ?? ""),
      equipmentType: String(formData.get("equipmentType") ?? ""),
      brand: String(formData.get("brand") ?? ""),
      model: String(formData.get("model") ?? ""),
      assetTag: String(formData.get("assetTag") ?? ""),
      serialNumber: String(formData.get("serialNumber") ?? ""),
      installationDate: String(formData.get("installationDate") ?? ""),
      maintenanceFrequencyDays: String(
        formData.get("maintenanceFrequencyDays") ?? ""
      ),
      status: String(formData.get("status") ?? "ACTIVE") as
        | "ACTIVE"
        | "IN_MAINTENANCE"
        | "REMOVED"
        | "REPLACED"
        | "INACTIVE",
      notes: String(formData.get("notes") ?? ""),
    };

    startTransition(async () => {
      try {
        if (equipment) {
          await updateEquipment(equipment.id, payload);
        } else {
          await createEquipment(payload);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao salvar equipamento."
        );
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
            onChange={(e) => handleCustomerChange(e.target.value)}
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
            Unidade
          </label>
          <select
            name="unitId"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            required
          >
            <option value="">Selecione</option>
            {filteredUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tipo de equipamento
          </label>
          <input
            name="equipmentType"
            value={equipmentType}
            onChange={(e) => setEquipmentType(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Ex.: Dispenser de Sabonete"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Marca
          </label>
          <input
            name="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Ex.: Higitech"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Modelo
          </label>
          <input
            name="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Patrimônio / Tag
          </label>
          <input
            name="assetTag"
            value={assetTag}
            onChange={(e) => setAssetTag(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Ex.: EQ-001"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Número de série
          </label>
          <input
            name="serialNumber"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Data de instalação
          </label>
          <input
            name="installationDate"
            type="date"
            value={installationDate}
            onChange={(e) => setInstallationDate(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Frequência de manutenção (dias)
          </label>
          <input
            name="maintenanceFrequencyDays"
            type="number"
            value={maintenanceFrequencyDays}
            onChange={(e) => setMaintenanceFrequencyDays(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="30"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="w-full rounded-xl border px-3 py-2"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
          {isPending
            ? "Salvando..."
            : equipment
              ? "Salvar alterações"
              : "Cadastrar equipamento"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/equipment")}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}