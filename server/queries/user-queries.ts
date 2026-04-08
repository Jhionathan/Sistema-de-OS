import { prisma } from "@/lib/prisma";
import { requireAuth, requireMasterDataAccess } from "@/lib/auth-guards";

export async function getUsers() {
  await requireMasterDataAccess();

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      technician: {
        select: {
          id: true,
        },
      },
      customer: {
        select: {
          id: true,
          tradeName: true,
          legalName: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUserById(id: string) {
  await requireMasterDataAccess();

  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      customerId: true,
      unitId: true,
      technician: {
        select: {
          id: true,
        },
      },
      customer: {
        select: {
          id: true,
          tradeName: true,
          legalName: true,
        }
      }
    },
  });
}

export async function getMe() {
  const session = await requireAuth();

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      customer: {
        select: {
          legalName: true,
          tradeName: true,
        },
      },
      unit: {
        select: {
          name: true,
        },
      },
    },
  });
}

