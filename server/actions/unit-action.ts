"use server";

import { prisma } from "@/lib/prisma";
import { unitSchema, type UnitInput } from "@/lib/validations/units";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function normalizeOptional(value?: string) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export async function createUnit(input: UnitInput) {
  const parsed = unitSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  await prisma.customerUnit.create({
    data: {
      customerId: data.customerId,
      name: data.name.trim(),
      contactName: normalizeOptional(data.contactName),
      contactPhone: normalizeOptional(data.contactPhone),
      street: normalizeOptional(data.street),
      number: normalizeOptional(data.number),
      district: normalizeOptional(data.district),
      city: normalizeOptional(data.city),
      state: normalizeOptional(data.state),
      zipCode: normalizeOptional(data.zipCode),
      notes: normalizeOptional(data.notes),
      isActive: data.isActive,
    },
  });

  revalidatePath("/units");
  redirect("/units");
}

export async function updateUnit(id: string, input: UnitInput) {
  const parsed = unitSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  await prisma.customerUnit.update({
    where: { id },
    data: {
      customerId: data.customerId,
      name: data.name.trim(),
      contactName: normalizeOptional(data.contactName),
      contactPhone: normalizeOptional(data.contactPhone),
      street: normalizeOptional(data.street),
      number: normalizeOptional(data.number),
      district: normalizeOptional(data.district),
      city: normalizeOptional(data.city),
      state: normalizeOptional(data.state),
      zipCode: normalizeOptional(data.zipCode),
      notes: normalizeOptional(data.notes),
      isActive: data.isActive,
    },
  });

  revalidatePath("/units");
  revalidatePath(`/units/${id}`);
  redirect("/units");
}

export async function toggleUnitStatus(id: string, isActive: boolean) {
  await prisma.customerUnit.update({
    where: { id },
    data: {
      isActive,
    },
  });

  revalidatePath("/units");
  revalidatePath(`/units/${id}`);
}