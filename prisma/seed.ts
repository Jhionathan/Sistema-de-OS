import "dotenv/config";
import { PrismaClient, UserRole, EquipmentStatus, VisitStatus, VisitType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const password = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@sistema.com",
      passwordHash: password,
      role: UserRole.ADMIN,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Gerente Operacional",
      email: "manager@sistema.com",
      passwordHash: password,
      role: UserRole.MANAGER,
    },
  });

  const techUser = await prisma.user.create({
    data: {
      name: "Carlos Técnico",
      email: "tecnico@sistema.com",
      passwordHash: password,
      role: UserRole.TECHNICIAN,
    },
  });

  const technician = await prisma.technician.create({
    data: {
      userId: techUser.id,
      name: "Carlos Técnico",
      email: "tecnico@sistema.com",
      phone: "(62) 99999-8888",
    },
  });

  const customer = await prisma.customer.create({
    data: {
      legalName: "Hospital Santa Helena LTDA",
      tradeName: "Hospital Santa Helena",
      document: "12.345.678/0001-90",
      email: "contato@hospitalhelena.com",
      phone: "(62) 3322-4455",
    },
  });

  const unit = await prisma.customerUnit.create({
    data: {
      customerId: customer.id,
      name: "Unidade Centro",
      contactName: "Mariana Souza",
      contactPhone: "(62) 99111-2222",
      city: "Goiânia",
      state: "GO",
    },
  });

  const equipment1 = await prisma.equipment.create({
    data: {
      customerId: customer.id,
      unitId: unit.id,
      equipmentType: "Dispenser de Sabonete",
      brand: "Higitech",
      model: "HT-200",
      assetTag: "EQ-001",
      serialNumber: "SN123456",
      status: EquipmentStatus.ACTIVE,
      maintenanceFrequencyDays: 30,
    },
  });

  const equipment2 = await prisma.equipment.create({
    data: {
      customerId: customer.id,
      unitId: unit.id,
      equipmentType: "Dispenser de Papel Toalha",
      brand: "Higitech",
      model: "HT-500",
      assetTag: "EQ-002",
      serialNumber: "SN987654",
      status: EquipmentStatus.ACTIVE,
      maintenanceFrequencyDays: 60,
    },
  });

  await prisma.visit.create({
    data: {
      equipmentId: equipment1.id,
      customerId: customer.id,
      unitId: unit.id,
      technicianId: technician.id,
      createdByUserId: admin.id,
      scheduledAt: new Date(),
      visitType: VisitType.PREVENTIVE,
      status: VisitStatus.COMPLETED,
      reportedIssue: "Manutenção preventiva",
      servicePerformed: "Limpeza e verificação de funcionamento",
    },
  });

  await prisma.visit.create({
    data: {
      equipmentId: equipment2.id,
      customerId: customer.id,
      unitId: unit.id,
      technicianId: technician.id,
      createdByUserId: manager.id,
      scheduledAt: new Date(),
      visitType: VisitType.CORRECTIVE,
      status: VisitStatus.IN_PROGRESS,
      reportedIssue: "Equipamento travando",
      servicePerformed: "Ajuste interno do mecanismo",
    },
  });

  console.log("Seed executado com sucesso 🚀");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });