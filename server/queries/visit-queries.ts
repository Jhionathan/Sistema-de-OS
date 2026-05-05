import { prisma } from "@/lib/prisma";
import { Prisma, VisitStatus, VisitType } from "@prisma/client";

type GetVisitsFilters = {
  status?: string;
  visitType?: string;
  technicianId?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
};

type SessionUser = {
  id?: string;
  role?: string;
  customerId?: string | null;
  unitId?: string | null;
};

export async function getVisits(
  filters?: GetVisitsFilters,
  user?: SessionUser
) {
  const where: Prisma.VisitWhereInput = {};

  if (user?.role === "TECHNICIAN") {
    const technician = await prisma.technician.findFirst({
      where: { userId: user.id },
      select: { id: true },
    });
    where.technicianId = technician?.id ?? "__no_match__";
  } else if (user?.role === "CUSTOMER") {
    where.customerId = user.customerId ?? "__no_match__";
    if (user.unitId) {
      where.unitId = user.unitId;
    }
  }

  if (filters?.status) {
    where.status = filters.status as VisitStatus;
  }

  if (filters?.visitType) {
    where.visitType = filters.visitType as VisitType;
  }

  if (filters?.technicianId && user?.role !== "TECHNICIAN") {
    where.technicianId = filters.technicianId;
  }

  if (filters?.customerId && user?.role !== "TECHNICIAN" && user?.role !== "CUSTOMER") {
    where.customerId = filters.customerId;
  }

  const scheduledAtFilter: Prisma.DateTimeFilter = {};

  if (filters?.dateFrom) {
    scheduledAtFilter.gte = new Date(filters.dateFrom);
  }

  if (filters?.dateTo) {
    const endDate = new Date(filters.dateTo);
    endDate.setHours(23, 59, 59, 999);
    scheduledAtFilter.lte = endDate;
  }

  if (Object.keys(scheduledAtFilter).length > 0) {
    where.scheduledAt = scheduledAtFilter;
  }

  return prisma.visit.findMany({
    where,
    orderBy: {
      scheduledAt: "desc",
    },
    include: {
      customer: true,
      unit: true,
      equipment: true,
      technician: true,
      createdBy: true,
    },
  });
}

export async function getVisitById(id: string) {
  return prisma.visit.findUnique({
    where: { id },
    include: {
      customer: true,
      unit: true,
      equipment: true,
      technician: true,
      createdBy: true,
      parts: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getEquipmentForVisitSelect(user?: SessionUser) {
  const where: Prisma.EquipmentWhereInput = {
    status: {
      in: ["ACTIVE", "IN_MAINTENANCE"],
    },
  };

  if (user?.role === "CUSTOMER") {
    where.customerId = user.customerId ?? "__no_match__";
    if (user.unitId) {
      where.unitId = user.unitId;
    }
  }

  return prisma.equipment.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      unit: true,
    },
  });
}

export async function getTechniciansForVisitSelect() {
  return prisma.technician.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getCustomersForVisitFilter() {
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