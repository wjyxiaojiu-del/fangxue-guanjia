import { eq, desc, and, ne } from "drizzle-orm";
import { db } from "../client";
import { parentProfiles } from "../schema/parent-profiles";
import type { ParentProfile } from "../schema/parent-profiles";

export async function getParentProfile(userId: string): Promise<ParentProfile | undefined> {
  const rows = await db.select().from(parentProfiles).where(eq(parentProfiles.userId, userId)).limit(1);
  return rows[0];
}

export async function upsertParentProfile(
  userId: string,
  data: Partial<Omit<ParentProfile, "id" | "userId" | "createdAt">>
): Promise<ParentProfile> {
  const existing = await getParentProfile(userId);
  if (existing) {
    const rows = await db
      .update(parentProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(parentProfiles.userId, userId))
      .returning();
    return rows[0];
  }
  const rows = await db
    .insert(parentProfiles)
    .values({ userId, displayName: data.displayName ?? "家长", ...data })
    .returning();
  return rows[0];
}

export async function incrementHelpCount(userId: string) {
  const profile = await getParentProfile(userId);
  if (!profile) return;
  await db
    .update(parentProfiles)
    .set({ helpCount: profile.helpCount + 1, updatedAt: new Date() })
    .where(eq(parentProfiles.userId, userId));
}

export async function incrementRequestCount(userId: string) {
  const profile = await getParentProfile(userId);
  if (!profile) return;
  await db
    .update(parentProfiles)
    .set({ requestCount: profile.requestCount + 1, updatedAt: new Date() })
    .where(eq(parentProfiles.userId, userId));
}
