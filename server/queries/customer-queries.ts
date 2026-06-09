import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getCustomers({
  search,
  status,
  page = 1,
  pageSize = 15,
}: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: Prisma.CustomerWhereInput = {};

  if (search) {
    where.OR = [
      { legalName: { contains: search, mode: "insensitive" } },
      { tradeName: { contains: search, mode: "insensitive" } },
      { document: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status === "active") where.isActive = true;
  else if (status === "inactive") where.isActive = false;

  const skip = (page - 1) * pageSize;

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.customer.count({ where }),
  ]);

  return { customers, total };
}

export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      units: {
        orderBy: {
          createdAt: "desc",
        },
      },
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
      },
      purchases: {
        orderBy: {
          purchasedAt: "desc",
        },
      },
    },
  });
}