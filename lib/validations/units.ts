import { z } from "zod";

export const unitSchema = z.object({
  customerId: z.string().min(1, "Selecione um cliente"),
  name: z.string().min(2, "Informe o nome da unidade"),
  contactName: z.string().optional().or(z.literal("")),
  contactPhone: z.string().optional().or(z.literal("")),
  street: z.string().optional().or(z.literal("")),
  number: z.string().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  zipCode: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type UnitInput = z.infer<typeof unitSchema>;