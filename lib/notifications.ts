import { NotificationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  itemId?: string;
  requestId?: string;
}) {
  const existing = await prisma.notification.findFirst({ where: { userId: data.userId, type: data.type, requestId: data.requestId ?? null } });
  if (existing) return existing;
  return prisma.notification.create({ data });
}
