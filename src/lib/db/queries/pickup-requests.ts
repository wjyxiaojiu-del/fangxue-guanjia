import { eq, desc, and, ne } from "drizzle-orm";
import { db } from "../client";
import { pickupRequests } from "../schema/pickup-requests";
import type { PickupRequest } from "../schema/pickup-requests";

// 获取需求广场：所有 pending 状态需求（不含自己发的）
export async function getPlazaRequests(excludeUserId?: string): Promise<PickupRequest[]> {
  const rows = await db
    .select()
    .from(pickupRequests)
    .where(
      excludeUserId
        ? and(eq(pickupRequests.status, "pending"), ne(pickupRequests.publisherId, excludeUserId))
        : eq(pickupRequests.status, "pending")
    )
    .orderBy(desc(pickupRequests.createdAt))
    .limit(50);
  return rows;
}

// 我发布的需求
export async function getMyPublishedRequests(userId: string): Promise<PickupRequest[]> {
  return db
    .select()
    .from(pickupRequests)
    .where(eq(pickupRequests.publisherId, userId))
    .orderBy(desc(pickupRequests.createdAt))
    .limit(20);
}

// 我接单的记录
export async function getMyAcceptedRequests(userId: string): Promise<PickupRequest[]> {
  return db
    .select()
    .from(pickupRequests)
    .where(eq(pickupRequests.acceptorId, userId))
    .orderBy(desc(pickupRequests.createdAt))
    .limit(20);
}

// 获取单条需求
export async function getRequestById(id: number): Promise<PickupRequest | undefined> {
  const rows = await db.select().from(pickupRequests).where(eq(pickupRequests.id, id)).limit(1);
  return rows[0];
}

// 发布新需求
export async function createPickupRequest(data: {
  publisherId: string;
  publisherName: string;
  publisherCommunity?: string;
  childName: string;
  childSchool: string;
  childGrade?: string;
  pickupTime: string;
  pickupDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  emergencyPhone?: string;
  aiText?: string;
}): Promise<PickupRequest> {
  const rows = await db.insert(pickupRequests).values(data).returning();
  return rows[0];
}

// 接单
export async function acceptRequest(
  id: number,
  acceptorId: string,
  acceptorName: string
): Promise<PickupRequest | undefined> {
  const rows = await db
    .update(pickupRequests)
    .set({
      status: "accepted",
      acceptorId,
      acceptorName,
      acceptedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(pickupRequests.id, id), eq(pickupRequests.status, "pending")))
    .returning();
  return rows[0];
}

// 完成打卡
export async function completeRequest(
  id: number,
  userId: string
): Promise<PickupRequest | undefined> {
  const rows = await db
    .update(pickupRequests)
    .set({ status: "completed", completedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(pickupRequests.id, id),
        and(eq(pickupRequests.publisherId, userId))
      )
    )
    .returning();
  return rows[0];
}

// 更新 AI 文案
export async function updateAiText(id: number, aiText: string): Promise<void> {
  await db.update(pickupRequests).set({ aiText, updatedAt: new Date() }).where(eq(pickupRequests.id, id));
}

// 取消需求
export async function cancelRequest(id: number, userId: string): Promise<void> {
  await db
    .update(pickupRequests)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(and(eq(pickupRequests.id, id), eq(pickupRequests.publisherId, userId)));
}
