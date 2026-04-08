import { prisma } from "@/lib/prisma";
import { EquipmentStatus } from "@prisma/client";

export async function getEquipment(
  user?: { role?: string; customerId?: string | null; unitId?: string | null },
  {
    search,
    customerId,
    status,
    page = 1,
    pageSize = 10,
  }: {
    search?: string;
    customerId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  // Base permission filters
  if (user?.role === "CUSTOMER") {
    where.customerId = user.customerId ?? "__no_match__";
    if (user.unitId) {
      where.unitId = user.unitId;
    }
  }

  // Optional filters (only for staff/admin)
  if (customerId && user?.role !== "CUSTOMER") {
    where.customerId = customerId;
  }

  if (status) {
    where.status = status as EquipmentStatus;
  }

  if (search) {
    where.OR = [
      { equipmentType: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { model: { contains: search, mode: "insensitive" } },
      { assetTag: { contains: search, mode: "insensitive" } },
      { serialNumber: { contains: search, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * pageSize;

  const [equipment, total] = await Promise.all([
    prisma.equipment.findMany({
      where,
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
      skip,
      take: pageSize,
    }),
    prisma.equipment.count({ where }),
  ]);

  return { equipment, total };
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