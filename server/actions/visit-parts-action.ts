"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireVisitPermission } from "@/lib/action-guards";
import { logActivity } from "./activity-log-action";
import { z } from "zod";

const addPartSchema = z.object({
  visitId: z.string().min(1),
  name: z.string().min(1, "Informe o nome da peça"),
  partNumber: z.string().optional(),
  quantity: z.coerce.number().int().min(1).default(1),
  unitCost: z.coerce.number().min(0).optional(),
});

export async function addVisitPart(input: unknown) {
  const session = await requireVisitPermission();

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

  await logActivity(
    session.user.id,
    "VISIT_PART",
    visitId,
    "ADD_PART",
    `Peça ${name} (Qtd: ${quantity}) adicionada à visita.`
  );

  revalidatePath(`/visits/${visitId}`);
}

export async function removeVisitPart(partId: string, visitId: string) {
  const session = await requireVisitPermission();

  const part = await prisma.visitPart.findUnique({ where: { id: partId } });
  if (part) {
    await prisma.visitPart.delete({ where: { id: partId } });
    await logActivity(
      session.user.id,
      "VISIT_PART",
      visitId,
      "REMOVE_PART",
      `Peça ${part.name} removida da visita.`
    );
  }

  revalidatePath(`/visits/${visitId}`);
}
