import { prisma } from "@/lib/prisma";

export async function getUnits() {
  return prisma.customerUnit.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      equipment: {
        select: {
          id: true,
        },
      },
      visits: {
        select: {
          id: true,
        },
      },
    },
  });
}

export async function getUnitById(id: string) {
  return prisma.customerUnit.findUnique({
    where: { id },
    include: {
      customer: true,
      equipment: {
        orderBy: {
          createdAt: "desc",
        },
      },
      visits: {
        orderBy: {
          scheduledAt: "desc",
        },
        take: 10,
        include: {
          technician: true,
        },
      },
    },
  });
}

export async function getCustomersForSelect() {
  return prisma.customer.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      legalName: "asc",
    },
    select: {
      id: true,
      legalName: true,
      tradeName: true,
    },
  });
}