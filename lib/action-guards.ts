import { auth } from "@/lib/auth";
import {
  canEditVisits,
  canManageMasterData,
  isTechnician,
} from "@/lib/permissions";

export async function requireAuthenticatedUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  return session;
}

export async function requireMasterDataPermission() {
  const session = await requireAuthenticatedUser();

  if (!canManageMasterData(session.user.role)) {
    throw new Error("Você não tem permissão para executar esta ação.");
  }

  return session;
}

export async function requireVisitPermission() {
  const session = await requireAuthenticatedUser();

  if (!canEditVisits(session.user.role)) {
    throw new Error("Você não tem permissão para executar esta ação.");
  }

  return session;
}

export async function requireTechnicianOwnershipOrPrivilegedAccess(
  technicianUserId?: string | null
) {
  const session = await requireAuthenticatedUser();

  const privileged = canManageMasterData(session.user.role);

  if (privileged) {
    return session;
  }

  if (isTechnician(session.user.role) && technicianUserId === session.user.id) {
    return session;
  }

  throw new Error("Você não tem permissão para alterar esta visita.");
}