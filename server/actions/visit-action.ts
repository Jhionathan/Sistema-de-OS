"use server";

import { prisma } from "@/lib/prisma";
import { visitSchema, type VisitInput } from "@/lib/validations/visit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  requireTechnicianOwnershipOrPrivilegedAccess,
  requireVisitPermission,
  requireAuthenticatedUser,
} from "@/lib/action-guards";

function normalizeOptional(value?: string) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function normalizeDateTime(value?: string) {
  if (!value || value.trim() === "") return null;
  return new Date(value);
}

export async function createVisit(input: VisitInput) {
  const session = await requireVisitPermission();

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

  if (session.user.role === "TECHNICIAN") {
    const technician = await prisma.technician.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!technician) {
      throw new Error("Técnico vinculado não encontrado.");
    }

    if (data.technicianId && data.technicianId !== technician.id) {
      throw new Error("Você só pode criar visitas para si mesmo.");
    }
  }

  await prisma.visit.create({
    data: {
      equipmentId: equipment.id,
      customerId: equipment.customerId,
      unitId: equipment.unitId,
      technicianId: data.technicianId || null,
      scheduledAt: new Date(data.scheduledAt),
      startedAt: normalizeDateTime(data.startedAt),
      finishedAt: normalizeDateTime(data.finishedAt),
      visitType: data.visitType,
      status: data.status,
      reportedIssue: normalizeOptional(data.reportedIssue),
      servicePerformed: normalizeOptional(data.servicePerformed),
      technicalNotes: normalizeOptional(data.technicalNotes),
      requiresReturn: data.requiresReturn,
      returnDueDate: normalizeDateTime(data.returnDueDate),
      createdByUserId: session.user.id,
    },
  });

  revalidatePath("/visits");
}

export async function updateVisit(id: string, input: VisitInput) {
  const session = await requireVisitPermission();

  const parsed = visitSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  const existingVisit = await prisma.visit.findUnique({
    where: { id },
    include: {
      technician: {
        select: {
          userId: true,
          id: true,
        },
      },
    },
  });

  if (!existingVisit) {
    throw new Error("Visita não encontrada.");
  }

  await requireTechnicianOwnershipOrPrivilegedAccess(
    existingVisit.technician?.userId
  );

  const equipment = await prisma.equipment.findUnique({
    where: { id: data.equipmentId },
  });

  if (!equipment) {
    throw new Error("Equipamento não encontrado.");
  }

  if (session.user.role === "TECHNICIAN") {
    const technician = await prisma.technician.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!technician) {
      throw new Error("Técnico vinculado não encontrado.");
    }

    if (data.technicianId && data.technicianId !== technician.id) {
      throw new Error("Você só pode manter visitas atribuídas a si mesmo.");
    }
  }

  await prisma.visit.update({
    where: { id },
    data: {
      equipmentId: equipment.id,
      customerId: equipment.customerId,
      unitId: equipment.unitId,
      technicianId: data.technicianId || null,
      scheduledAt: new Date(data.scheduledAt),
      startedAt: normalizeDateTime(data.startedAt),
      finishedAt: normalizeDateTime(data.finishedAt),
      visitType: data.visitType,
      status: data.status,
      reportedIssue: normalizeOptional(data.reportedIssue),
      servicePerformed: normalizeOptional(data.servicePerformed),
      technicalNotes: normalizeOptional(data.technicalNotes),
      requiresReturn: data.requiresReturn,
      returnDueDate: normalizeDateTime(data.returnDueDate),
    },
  });

  revalidatePath("/visits");
  revalidatePath("/tickets");
  revalidatePath(`/visits/${id}`);
}

export async function createTicket(data: { equipmentId: string, reportedIssue: string, scheduledAt: string }) {
  const session = await requireAuthenticatedUser();

  if (!data.equipmentId || !data.reportedIssue || !data.scheduledAt) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const equipment = await prisma.equipment.findUnique({
    where: { id: data.equipmentId },
  });

  if (!equipment) {
    throw new Error("Equipamento não encontrado.");
  }

  // Se for CUSTOMER, só pode abrir ticket na própria empresa
  if (session.user.role === "CUSTOMER") {
    if (equipment.customerId !== session.user.customerId) {
        throw new Error("Acesso negado ao equipamento.");
    }
  }

  await prisma.visit.create({
    data: {
      equipmentId: equipment.id,
      customerId: equipment.customerId,
      unitId: equipment.unitId,
      scheduledAt: new Date(data.scheduledAt),
      visitType: "CORRECTIVE",
      status: "REQUESTED",
      reportedIssue: data.reportedIssue,
      requiresReturn: false,
      createdByUserId: session.user.id,
    },
  });

  revalidatePath("/visits");
  revalidatePath("/tickets");
}