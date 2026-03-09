import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const [
    totalCustomers,
    totalActiveEquipment,
    visitsToday,
    pendingReturns,
    recentVisits,
    highlightedEquipment,
  ] = await Promise.all([
    prisma.customer.count({
      where: { isActive: true },
    }),
    prisma.equipment.count({
      where: { status: "ACTIVE" },
    }),
    prisma.visit.count({
      where: {
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),
    prisma.visit.count({
      where: {
        status: "PENDING_RETURN",
      },
    }),
    prisma.visit.findMany({
      orderBy: {
        scheduledAt: "desc",
      },
      take: 5,
      include: {
        customer: true,
        equipment: true,
        technician: true,
      },
    }),
    prisma.equipment.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        customer: true,
      },
    }),
  ]);

  return {
    totalCustomers,
    totalActiveEquipment,
    visitsToday,
    pendingReturns,
    recentVisits,
    highlightedEquipment,
  };
}