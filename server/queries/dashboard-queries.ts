import { prisma } from "@/lib/prisma";

type DashboardUser = {
  id?: string;
  role?: string;
};

export async function getDashboardStats(user?: DashboardUser) {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const isTechnician = user?.role === "TECHNICIAN";

  let technicianId: string | null = null;

  if (isTechnician && user?.id) {
    const technician = await prisma.technician.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    technicianId = technician?.id ?? null;
  }

  const visitWhereForTechnician = technicianId
    ? { technicianId }
    : isTechnician
      ? { technicianId: "__no_match__" }
      : {};

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
    isTechnician
      ? Promise.resolve(0)
      : prisma.customer.count({
          where: { isActive: true },
        }),

    isTechnician
      ? Promise.resolve(0)
      : prisma.equipment.count({
          where: { status: "ACTIVE" },
        }),

    prisma.visit.count({
      where: {
        ...visitWhereForTechnician,
        scheduledAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    }),

    prisma.visit.count({
      where: {
        ...visitWhereForTechnician,
        status: "PENDING_RETURN",
      },
    }),

    prisma.visit.count({
      where: {
        ...visitWhereForTechnician,
        scheduledAt: {
          lt: now,
        },
        status: {
          in: ["SCHEDULED", "IN_PROGRESS", "PENDING_RETURN"],
        },
      },
    }),

    isTechnician
      ? Promise.resolve(0)
      : prisma.equipment.count({
          where: {
            status: "IN_MAINTENANCE",
          },
        }),

    prisma.visit.count({
      where: {
        ...visitWhereForTechnician,
        status: "COMPLETED",
        scheduledAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    }),

    isTechnician
      ? Promise.resolve(0)
      : prisma.technician.count({
          where: {
            isActive: true,
          },
        }),

    prisma.visit.findMany({
      where: {
        ...visitWhereForTechnician,
      },
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
        ...visitWhereForTechnician,
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
      where: {
        ...visitWhereForTechnician,
      },
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
    isTechnician,
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