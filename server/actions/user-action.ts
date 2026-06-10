"use server";

import { prisma } from "@/lib/prisma";
import { createUserSchema, updateUserSchema, changePasswordSchema, type CreateUserInput, type UpdateUserInput, type ChangePasswordInput } from "@/lib/validations/user";
import { revalidatePath } from "next/cache";
import { requireAuth, requireMasterDataAccess } from "@/lib/auth-guards";
import { logActivity } from "./activity-log-action";
import bcrypt from "bcryptjs";

function getPermissionError(currentUserRole: string, targetRole: string) {
  if (currentUserRole === "MANAGER" && (targetRole === "ADMIN" || targetRole === "MANAGER")) {
    return "Gestores só podem criar ou conceder privilégios de Técnico ou Cliente.";
  }
  return null;
}

export async function createUser(input: CreateUserInput) {
  const session = await requireMasterDataAccess();
  const parsed = createUserSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  const permissionError = getPermissionError(session.user.role ?? "", data.role);
  if (permissionError) {
    throw new Error(permissionError);
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingEmail) {
    throw new Error("Este e-mail já está em uso.");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      role: data.role as any,
      passwordHash,
      isActive: data.isActive,
      customerId: data.role === "CUSTOMER" ? data.customerId : null,
      unitId: data.role === "CUSTOMER" ? data.unitId : null,
    },
  });

  if (data.role === "TECHNICIAN") {
    await prisma.technician.create({
      data: {
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isActive: true,
      },
    });
  }

  await logActivity(
    session.user.id,
    "USER",
    newUser.id,
    "CREATE",
    `Usuário ${newUser.name} (${newUser.email}) criado.`
  );

  revalidatePath("/users");
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const session = await requireMasterDataAccess();
  const parsed = updateUserSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const data = parsed.data;

  // Validate if it targets ADMIN / MANAGER by a MANAGER
  const permissionError = getPermissionError(session.user.role ?? "", data.role);
  if (permissionError) {
    throw new Error(permissionError);
  }

  const existingUser = await prisma.user.findUnique({
    where: { id },
    include: { technician: true }
  });

  if (!existingUser) {
    throw new Error("Usuário não encontrado.");
  }

  // Prevents MANAGER from managing another MANAGER or ADMIN
  if (session.user.role === "MANAGER" && (existingUser.role === "ADMIN" || existingUser.role === "MANAGER")) {
    throw new Error("Gestores não têm permissão para editar outros Gestores ou Administradores.");
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingEmail && existingEmail.id !== id) {
    throw new Error("Este e-mail já está em uso por outro usuário.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    name: data.name,
    email: data.email,
    role: data.role,
    isActive: data.isActive,
    customerId: data.role === "CUSTOMER" ? data.customerId : null,
    unitId: data.role === "CUSTOMER" ? data.unitId : null,
  };

  if (data.password && data.password.trim() !== "") {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  // Handle Technician profile creation/update
  if (updatedUser.role === "TECHNICIAN" && !existingUser.technician) {
    await prisma.technician.create({
      data: {
        userId: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isActive: true,
      },
    });
  } else if (updatedUser.role !== "TECHNICIAN" && existingUser.technician) {
    await prisma.technician.update({
      where: { id: existingUser.technician.id },
      data: { isActive: false },
    });
  } else if (existingUser.technician) {
    await prisma.technician.update({
      where: { id: existingUser.technician.id },
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        isActive: updatedUser.isActive,
      },
    });
  }

  await logActivity(
    session.user.id,
    "USER",
    id,
    "UPDATE",
    `Usuário ${updatedUser.name} (${updatedUser.email}) atualizado.`
  );

  revalidatePath("/users");
}

export async function adminResetPassword(userId: string, newPassword: string) {
  const session = await requireMasterDataAccess();

  if (!newPassword || newPassword.length < 6) {
    throw new Error("A nova senha deve ter no mínimo 6 caracteres.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Usuário não encontrado.");

  if (session.user.role === "MANAGER" && (user.role === "ADMIN" || user.role === "MANAGER")) {
    throw new Error("Gestores não têm permissão para redefinir a senha de Administradores ou outros Gestores.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  await logActivity(
    session.user.id,
    "USER",
    userId,
    "RESET_PASSWORD",
    `Senha do usuário ${user.name} redefinida pelo administrador.`
  );

  revalidatePath(`/users/${userId}`);
}

export async function updateOwnPassword(input: ChangePasswordInput) {
  const session = await requireAuth();
  
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Dados de senha inválidos.");
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    throw new Error("Senha atual incorreta.");
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  await logActivity(
    session.user.id,
    "USER",
    user.id,
    "UPDATE_PASSWORD",
    "Senha alterada com sucesso."
  );

  revalidatePath("/profile");
}

