"use server";

import { prisma } from "@/lib/prisma";
import { requireMasterDataPermission } from "@/lib/action-guards";
import { revalidatePath } from "next/cache";
import { logActivity } from "./activity-log-action";
import { z } from "zod";

export const systemSettingSchema = z.object({
  companyName: z.string().min(1, "Nome da empresa é obrigatório"),
  companyDocument: z.string().optional().nullable(),
  contactEmail: z.string().email("E-mail inválido").optional().nullable().or(z.literal("")),
  contactPhone: z.string().optional().nullable(),
  slaLowHours: z.coerce.number().min(1),
  slaMediumHours: z.coerce.number().min(1),
  slaHighHours: z.coerce.number().min(1),
  slaUrgentHours: z.coerce.number().min(1),
});

export type SystemSettingInput = z.infer<typeof systemSettingSchema>;

export async function updateSystemSettings(input: SystemSettingInput) {
  const session = await requireMasterDataPermission();

  const parsed = systemSettingSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Dados de configuração inválidos.");
  }

  const data = parsed.data;

  await prisma.systemSetting.upsert({
    where: { id: "default" },
    update: {
      companyName: data.companyName,
      companyDocument: data.companyDocument || null,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      slaLowHours: data.slaLowHours,
      slaMediumHours: data.slaMediumHours,
      slaHighHours: data.slaHighHours,
      slaUrgentHours: data.slaUrgentHours,
    },
    create: {
      id: "default",
      companyName: data.companyName,
      companyDocument: data.companyDocument || null,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      slaLowHours: data.slaLowHours,
      slaMediumHours: data.slaMediumHours,
      slaHighHours: data.slaHighHours,
      slaUrgentHours: data.slaUrgentHours,
    },
  });

  await logActivity(
    session.user.id,
    "SYSTEM_SETTING",
    "default",
    "UPDATE",
    "Configurações globais do sistema foram atualizadas."
  );

  revalidatePath("/settings");
  revalidatePath("/dashboard"); // SLA affects dashboards maybe
}
