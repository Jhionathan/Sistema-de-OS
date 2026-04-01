import { z } from "zod";

export const technicianSchema = z.object({
  name: z.string().min(2, "Informe o nome do técnico"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type TechnicianInput = z.infer<typeof technicianSchema>;