import { z } from "zod";

export const equipmentSchema = z.object({
  customerId: z.string().min(1, "Selecione um cliente"),
  unitId: z.string().min(1, "Selecione uma unidade"),
  equipmentType: z.string().min(2, "Informe o tipo do equipamento"),
  brand: z.string().optional().or(z.literal("")),
  model: z.string().optional().or(z.literal("")),
  assetTag: z.string().optional().or(z.literal("")),
  serialNumber: z.string().optional().or(z.literal("")),
  installationDate: z.string().optional().or(z.literal("")),
  maintenanceFrequencyDays: z.string().optional().or(z.literal("")),
  status: z.enum([
    "ACTIVE",
    "IN_MAINTENANCE",
    "REMOVED",
    "REPLACED",
    "INACTIVE",
  ]),
  notes: z.string().optional().or(z.literal("")),
});

export type EquipmentInput = z.infer<typeof equipmentSchema>;