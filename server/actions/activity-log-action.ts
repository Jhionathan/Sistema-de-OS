"use server";

import { prisma } from "@/lib/prisma";

export async function logActivity(
  userId: string | undefined | null,
  entityType: string,
  entityId: string,
  action: string,
  description?: string
) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId || null,
        entityType,
        entityId,
        action,
        description,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar log de atividade:", error);
    // Não lançamos o erro para não quebrar o fluxo principal se o log falhar
  }
}
