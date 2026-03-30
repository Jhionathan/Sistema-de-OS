"use server";

import { prisma } from "@/lib/prisma";
import { visitSchema, type VisitInput } from "@/lib/validations/visit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

function normalizeOptional(value?: string) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function normalizeDate(value?: string) {
  if (!value || value.trim() === "") return null;
  return new Date(value);
}

export async function createVisit(input: VisitInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  const parsed = visitSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  const equipment = await prisma.equipment.findUnique({
    where: { id: data.equipmentId },
    include: {
      customer: true,
      unit: true,
    },
  });

  if (!equipment) {
    throw new Error("Equipamento não encontrado.");
  }

  await prisma.visit.create({
    data: {
      equipmentId: equipment.id,
      customerId: equipment.customerId,
      unitId: equipment.unitId,
      technicianId: data.technicianId ? data.technicianId : null,
      scheduledAt: new Date(data.scheduledAt),
      startedAt: normalizeDate(data.startedAt),
      finishedAt: normalizeDate(data.finishedAt),
      visitType: data.visitType,
      status: data.status,
      reportedIssue: normalizeOptional(data.reportedIssue),
      servicePerformed: normalizeOptional(data.servicePerformed),
      technicalNotes: normalizeOptional(data.technicalNotes),
      requiresReturn: data.requiresReturn,
      returnDueDate: normalizeDate(data.returnDueDate),
      createdByUserId: session.user.id,
    },
  });

  revalidatePath("/visits");
  redirect("/visits");
}

export async function updateVisit(id: string, input: VisitInput) {
  const parsed = visitSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  const equipment = await prisma.equipment.findUnique({
    where: { id: data.equipmentId },
  });

  if (!equipment) {
    throw new Error("Equipamento não encontrado.");
  }

  await prisma.visit.update({
    where: { id },
    data: {
      equipmentId: equipment.id,
      customerId: equipment.customerId,
      unitId: equipment.unitId,
      technicianId: data.technicianId ? data.technicianId : null,
      scheduledAt: new Date(data.scheduledAt),
      startedAt: normalizeDate(data.startedAt),
      finishedAt: normalizeDate(data.finishedAt),
      visitType: data.visitType,
      status: data.status,
      reportedIssue: normalizeOptional(data.reportedIssue),
      servicePerformed: normalizeOptional(data.servicePerformed),
      technicalNotes: normalizeOptional(data.technicalNotes),
      requiresReturn: data.requiresReturn,
      returnDueDate: normalizeDate(data.returnDueDate),
    },
  });

  revalidatePath("/visits");
  revalidatePath(`/visits/${id}`);
  redirect("/visits");
}