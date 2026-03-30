import { prisma } from "@/lib/prisma";

export async function getEquipment() {
  return prisma.equipment.findMany({
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