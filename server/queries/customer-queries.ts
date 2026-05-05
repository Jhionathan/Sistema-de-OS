import { prisma } from "@/lib/prisma";

export async function getCustomers() {
  return prisma.customer.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
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