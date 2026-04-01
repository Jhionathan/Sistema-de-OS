import { prisma } from "@/lib/prisma";

export async function getEquipment(user?: { role?: string; customerId?: string | null; unitId?: string | null }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let baseFilters: any = {};
  if (user?.role === "CUSTOMER") {
    baseFilters = {
      customerId: user.customerId ?? "__no_match__",
      ...(user.unitId ? { unitId: user.unitId } : {}),
    };
  }

  return prisma.equipment.findMany({
    where: {
      ...baseFilters,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      unit: true,
      visits: {
        select: {
          id: true,
        },
      },
    },
  });
}

export async function getEquipmentById(id: string) {
  return prisma.equipment.findUnique({
    where: { id },
    include: {
      customer: true,
      unit: true,
      visits: {
        orderBy: {
          scheduledAt: "desc",
        },
        include: {
          technician: true,
        },
        take: 10,
      },
    },
  });
}

export async function getCustomersForEquipmentSelect() {
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

export async function getUnitsForEquipmentSelect(customerId?: string) {
  return prisma.customerUnit.findMany({
    where: {
      isActive: true,
      ...(customerId ? { customerId } : {}),
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      customerId: true,
    },
  });
}