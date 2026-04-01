import { prisma } from "@/lib/prisma";

type DashboardUser = {
  id?: string;
  role?: string;
  customerId?: string | null;
  unitId?: string | null;
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
  const isCustomer = user?.role === "CUSTOMER";

  let technicianId: string | null = null;
  if (isTechnician && user?.id) {
    const technician = await prisma.technician.findFirst({
      where: { userId: user.id },
      select: { id: true },
    });
    technicianId = technician?.id ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let baseFilters: any = {};
  if (isTechnician) {
    baseFilters = technicianId ? { technicianId } : { technicianId: "__no_match__" };
  } else if (isCustomer) {
    baseFilters = {
      customerId: user?.customerId ?? "__no_match__",
      ...(user?.unitId ? { unitId: user.unitId } : {}),
    };
  }

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
    isTechnician || isCustomer
      ? Promise.resolve(0)
      : prisma.customer.count({
          where: { isActive: true },
        }),

    isTechnician
      ? Promise.resolve(0)
      : prisma.equipment.count({
          where: { status: "ACTIVE", ...baseFilters },
        }),

    prisma.visit.count({
      where: {
        ...baseFilters,
        scheduledAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    }),

    prisma.visit.count({
      where: {
        ...baseFilters,
        status: "PENDING_RETURN",
      },
    }),

    prisma.visit.count({
      where: {
        ...baseFilters,
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
            ...baseFilters,
          },
        }),

    prisma.visit.count({
      where: {
        ...baseFilters,
        status: "COMPLETED",
        scheduledAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    }),

    isTechnician || isCustomer
      ? Promise.resolve(0)
      : prisma.technician.count({
          where: {
            isActive: true,
          },
        }),

    prisma.visit.findMany({
      where: {
        ...baseFilters,
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
        ...baseFilters,
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
        ...baseFilters,
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
    isCustomer,
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