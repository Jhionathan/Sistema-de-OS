import { prisma } from "@/lib/prisma";
import { requireMasterDataPermission } from "@/lib/action-guards";

export async function getSystemSettings() {
  await requireMasterDataPermission();

  let settings = await prisma.systemSetting.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.systemSetting.create({
      data: {
        id: "default",
      },
    });
  }

  return settings;
}
