"use server";

import { prisma } from "@/lib/prisma";
import {
  equipmentSchema,
  type EquipmentInput,
} from "@/lib/validations/equipment";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function normalizeOptional(value?: string) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function normalizeDate(value?: string) {
  if (!value || value.trim() === "") return null;
  return new Date(value);
}

function normalizeFrequency(value?: string) {
  if (!value || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function createEquipment(input: EquipmentInput) {
  const parsed = equipmentSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  await prisma.equipment.create({
    data: {
      customerId: data.customerId,
      unitId: data.unitId,
      equipmentType: data.equipmentType.trim(),
      brand: normalizeOptional(data.brand),
      model: normalizeOptional(data.model),
      assetTag: normalizeOptional(data.assetTag),
      serialNumber: normalizeOptional(data.serialNumber),
      installationDate: normalizeDate(data.installationDate),
      maintenanceFrequencyDays: normalizeFrequency(data.maintenanceFrequencyDays),
      status: data.status,
      notes: normalizeOptional(data.notes),
    },
  });

  revalidatePath("/equipment");
  redirect("/equipment");
}

export async function updateEquipment(id: string, input: EquipmentInput) {
  const parsed = equipmentSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  await prisma.equipment.update({
    where: { id },
    data: {
      customerId: data.customerId,
      unitId: data.unitId,
      equipmentType: data.equipmentType.trim(),
      brand: normalizeOptional(data.brand),
      model: normalizeOptional(data.model),
      assetTag: normalizeOptional(data.assetTag),
      serialNumber: normalizeOptional(data.serialNumber),
      installationDate: normalizeDate(data.installationDate),
      maintenanceFrequencyDays: normalizeFrequency(data.maintenanceFrequencyDays),
      status: data.status,
      notes: normalizeOptional(data.notes),
    },
  });

  revalidatePath("/equipment");
  revalidatePath(`/equipment/${id}`);
  redirect("/equipment");
}