import * as z from "zod";

export const userRoleEnum = z.enum(["ADMIN", "MANAGER", "TECHNICIAN", "CUSTOMER"]);

export const userBaseSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido").min(1, "O e-mail é obrigatório"),
  role: userRoleEnum,
  customerId: z.string().optional().nullable(),
  unitId: z.string().optional().nullable(),
  isActive: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.role === "CUSTOMER" && !data.customerId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["customerId"],
      message: "Selecione uma empresa para vincular o cliente.",
    });
  }
});

export const createUserSchema = userBaseSchema.extend({
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const updateUserSchema = userBaseSchema.extend({
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .optional()
    .or(z.literal("")),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "A senha atual é obrigatória"),
    newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

