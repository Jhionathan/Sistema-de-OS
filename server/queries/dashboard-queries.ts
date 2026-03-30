import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const [
    totalCustomers,
    totalActiveEquipment,
    visitsToday,
    pendingReturns,
    overdueVisits,
    equipmentInMaintenance,
    completedThisMonth,
    activeTechnicians,
    recentVisits,
    nextVisits,
    visitsByStatus,
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
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    }),

    prisma.visit.count({
      where: {
        status: "PENDING_RETURN",
      },
    }),

    prisma.visit.count({
      where: {
        scheduledAt: {
          lt: now,
        },
        status: {
          in: ["SCHEDULED", "IN_PROGRESS", "PENDING_RETURN"],
        },
      },
    }),

    prisma.equipment.count({
      where: {
        status: "IN_MAINTENANCE",
      },
    }),

    prisma.visit.count({
      where: {
        status: "COMPLETED",
        scheduledAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    }),

    prisma.technician.count({
      where: {
        isActive: true,
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
        unit: true,
      },
    }),

    prisma.visit.findMany({
      where: {
        scheduledAt: {
          gte: now,
        },
        status: {
          in: ["SCHEDULED", "IN_PROGRESS"],
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 5,
      include: {
        customer: true,
        equipment: true,
        technician: true,
        unit: true,
      },
    }),

    prisma.visit.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),
  ]);

  const statusMap = {
    SCHEDULED: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELED: 0,
    PENDING_RETURN: 0,
  };

  for (const item of visitsByStatus) {
    statusMap[item.status] = item._count.status;
  }

  return {
    totalCustomers,
    totalActiveEquipment,
    visitsToday,
    pendingReturns,
    overdueVisits,
    equipmentInMaintenance,
    completedThisMonth,
    activeTechnicians,
    recentVisits,
    nextVisits,
    visitsByStatus: statusMap,
  };
}