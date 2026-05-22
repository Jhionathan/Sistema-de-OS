"use server";

import { requireMasterDataPermission } from "@/lib/action-guards";
import { logActivity } from "./activity-log-action";
import { prisma } from "@/lib/prisma";
import {
  equipmentSchema,
  type EquipmentInput,
} from "@/lib/validations/equipment";
import { getNextEquipmentSequentials } from "@/server/queries/equipment-queries";
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



export async function createEquipment(input: EquipmentInput) {
  const session = await requireMasterDataPermission();
  const parsed = equipmentSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  let assetTag = normalizeOptional(data.assetTag);
  let serialNumber = normalizeOptional(data.serialNumber);

  if (!assetTag || !serialNumber) {
    const sequentials = await getNextEquipmentSequentials();
    if (!assetTag) {
      assetTag = sequentials.nextAssetTag;
    }
    if (!serialNumber) {
      serialNumber = sequentials.nextSerialNumber;
    }
  }

  const equipment = await prisma.equipment.create({
    data: {
      customerId: data.customerId,
      unitId: data.unitId,
      equipmentType: data.equipmentType.trim(),
      brand: normalizeOptional(data.brand),
      model: normalizeOptional(data.model),
      assetTag,
      serialNumber,
      installationDate: normalizeDate(data.installationDate),
      status: data.status,
      notes: normalizeOptional(data.notes),
    },
  });

  await logActivity(
    session.user.id,
    "EQUIPMENT",
    equipment.id,
    "CREATE",
    `Equipamento ${equipment.equipmentType} adicionado.`
  );

  revalidatePath("/equipment");
}

export async function updateEquipment(id: string, input: EquipmentInput) {
  const session = await requireMasterDataPermission();
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
      status: data.status,
      notes: normalizeOptional(data.notes),
    },
  });

  await logActivity(
    session.user.id,
    "EQUIPMENT",
    id,
    "UPDATE",
    `Equipamento ${data.equipmentType} atualizado.`
  );

  revalidatePath("/equipment");
  revalidatePath(`/equipment/${id}`);
}