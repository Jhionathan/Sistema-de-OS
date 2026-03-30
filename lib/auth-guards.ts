import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  canManageMasterData,
  canViewOperationalData,
} from "@/lib/permissions";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function requireMasterDataAccess() {
  const session = await requireAuth();

  if (!canManageMasterData(session.user.role)) {
    redirect("/dashboard");
  }

  return session;
}

export async function requireOperationalAccess() {
  const session = await requireAuth();

  if (!canViewOperationalData(session.user.role)) {
    redirect("/dashboard");
  }

  return session;
}