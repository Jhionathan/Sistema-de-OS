import { z } from "zod";

export const customerSchema = z.object({
  legalName: z.string().min(2, "Informe a razão social ou nome"),
  tradeName: z.string().optional().or(z.literal("")),
  document: z.string().optional().or(z.literal("")),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type CustomerInput = z.infer<typeof customerSchema>;