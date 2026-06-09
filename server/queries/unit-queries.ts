import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getUnits({
  search,
  page = 1,
  pageSize = 15,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: Prisma.CustomerUnitWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { contactName: { contains: search, mode: "insensitive" } },
      { customer: { legalName: { contains: search, mode: "insensitive" } } },
      { customer: { tradeName: { contains: search, mode: "insensitive" } } },
    ];
  }

  const skip = (page - 1) * pageSize;

  const [units, total] = await Promise.all([
    prisma.customerUnit.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        equipment: { select: { id: true } },
        visits: { select: { id: true } },
      },
      skip,
      take: pageSize,
    }),
    prisma.customerUnit.count({ where }),
  ]);

  return { units, total };
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