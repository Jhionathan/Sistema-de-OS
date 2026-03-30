import { prisma } from "@/lib/prisma";

export async function getVisits() {
  return prisma.visit.findMany({
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