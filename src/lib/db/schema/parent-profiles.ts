import { pgTable, serial, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";

// 家长资料表（真实落地版：用户注册后填写）
export const parentProfiles = pgTable("parent_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),      // 对应 Eazo auth user id
  displayName: varchar("display_name", { length: 50 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  community: varchar("community", { length: 100 }), // 所在小区
  childName: varchar("child_name", { length: 50 }),
  childSchool: varchar("child_school", { length: 100 }),
  childGrade: varchar("child_grade", { length: 20 }),
  avatarInitial: varchar("avatar_initial", { length: 5 }),
  helpCount: integer("help_count").notNull().default(0),    // 接单次数
  requestCount: integer("request_count").notNull().default(0), // 发单次数
  trustScore: integer("trust_score").notNull().default(100),   // 信用分 0-200
  onboardingDone: integer("onboarding_done").notNull().default(0), // 0=未完成,1=完成
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ParentProfile = InferSelectModel<typeof parentProfiles>;
