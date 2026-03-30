import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type GetVisitsFilters = {
  status?: string;
  visitType?: string;
  technicianId?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export async function getVisits(filters?: GetVisitsFilters) {
  const where: Prisma.VisitWhereInput = {};

  if (filters?.status) {
    where.status = filters.status as Prisma.EnumVisitStatusFilter["equals"];
  }

  if (filters?.visitType) {
    where.visitType =
      filters.visitType as Prisma.EnumVisitTypeFilter["equals"];
  }

  if (filters?.technicianId) {
    where.technicianId = filters.technicianId;
  }

  if (filters?.customerId) {
    where.customerId = filters.customerId;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    where.scheduledAt = {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scheduledAtFilter: any = {};

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
    },
  });
}

export async function getEquipmentForVisitSelect() {
  return prisma.equipment.findMany({
    where: {
      status: {
        in: ["ACTIVE", "IN_MAINTENANCE"],
      },
    },
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