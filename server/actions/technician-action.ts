"use server";
import { requireMasterDataPermission } from "@/lib/action-guards";
import { prisma } from "@/lib/prisma";
import {
  technicianSchema,
  type TechnicianInput,
} from "@/lib/validations/technician";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function normalizeOptional(value?: string) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export async function createTechnician(input: TechnicianInput) {
  await requireMasterDataPermission();
  const parsed = technicianSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  await prisma.technician.create({
    data: {
      name: data.name.trim(),
      email: normalizeOptional(data.email),
      phone: normalizeOptional(data.phone),
      isActive: data.isActive,
    },
  });

  revalidatePath("/technicians");
  redirect("/technicians");
}

export async function updateTechnician(id: string, input: TechnicianInput) {
  await requireMasterDataPermission();
  const parsed = technicianSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  await prisma.technician.update({
    where: { id },
    data: {
      name: data.name.trim(),
      email: normalizeOptional(data.email),
      phone: normalizeOptional(data.phone),
      isActive: data.isActive,
    },
  });

  revalidatePath("/technicians");
  revalidatePath(`/technicians/${id}`);
  redirect("/technicians");
}

export async function toggleTechnicianStatus(id: string, isActive: boolean) {
  await requireMasterDataPermission();
  await prisma.technician.update({
    where: { id },
    data: {
      isActive,
    },
  });

  revalidatePath("/technicians");
  revalidatePath(`/technicians/${id}`);
}