"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireVisitPermission } from "@/lib/action-guards";
import { z } from "zod";

const addPartSchema = z.object({
  visitId: z.string().min(1),
  name: z.string().min(1, "Informe o nome da peça"),
  partNumber: z.string().optional(),
  quantity: z.coerce.number().int().min(1).default(1),
  unitCost: z.coerce.number().min(0).optional(),
});

export async function addVisitPart(input: unknown) {
  await requireVisitPermission();

  const parsed = addPartSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  const { visitId, name, partNumber, quantity, unitCost } = parsed.data;

  const visit = await prisma.visit.findUnique({ where: { id: visitId } });
  if (!visit) throw new Error("Visita não encontrada.");

  await prisma.visitPart.create({
    data: {
      visitId,
      name: name.trim(),
      partNumber: partNumber?.trim() || null,
      quantity,
      unitCost: unitCost ?? null,
    },
  });

  revalidatePath(`/visits/${visitId}`);
}

export async function removeVisitPart(partId: string, visitId: string) {
  await requireVisitPermission();

  await prisma.visitPart.delete({ where: { id: partId } });

  revalidatePath(`/visits/${visitId}`);
}
