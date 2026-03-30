import { prisma } from "@/lib/prisma";

export async function getTechnicians() {
  return prisma.technician.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      visits: {
        select: {
          id: true,
        },
      },
    },
  });
}

export async function getTechnicianById(id: string) {
  return prisma.technician.findUnique({
    where: { id },
    include: {
      user: true,
      visits: {
        orderBy: {
          scheduledAt: "desc",
        },
        take: 10,
        include: {
          equipment: true,
          customer: true,
          unit: true,
        },
      },
    },
  });
}