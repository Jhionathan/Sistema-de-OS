import { prisma } from "@/lib/prisma";
import { requireMasterDataPermission } from "@/lib/action-guards";

export async function getActivityLogs(page = 1, pageSize = 50) {
  await requireMasterDataPermission();

  const skip = (page - 1) * pageSize;

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.activityLog.count(),
  ]);

  return {
    logs,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
    total,
  };
}
