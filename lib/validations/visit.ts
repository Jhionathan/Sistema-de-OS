import { z } from "zod";

export const visitSchema = z.object({
  equipmentId: z.string().min(1, "Selecione um equipamento"),
  technicianId: z.string().optional().or(z.literal("")),
  scheduledAt: z.string().min(1, "Informe a data da visita"),
  startedAt: z.string().optional().or(z.literal("")),
  finishedAt: z.string().optional().or(z.literal("")),
  visitType: z.enum([
    "PREVENTIVE",
    "CORRECTIVE",
    "INSTALLATION",
    "REPLACEMENT",
    "REMOVAL",
    "INSPECTION",
  ]),
  status: z.enum([
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELED",
    "PENDING_RETURN",
  ]),
  reportedIssue: z.string().optional().or(z.literal("")),
  servicePerformed: z.string().optional().or(z.literal("")),
  technicalNotes: z.string().optional().or(z.literal("")),
  requiresReturn: z.boolean().default(false),
  returnDueDate: z.string().optional().or(z.literal("")),
});

export type VisitInput = z.infer<typeof visitSchema>;