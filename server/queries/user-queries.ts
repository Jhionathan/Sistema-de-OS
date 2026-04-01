import { prisma } from "@/lib/prisma";
import { requireMasterDataAccess } from "@/lib/auth-guards";

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
