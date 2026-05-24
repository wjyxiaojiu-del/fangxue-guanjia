import { pgTable, serial, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";

// 接送需求表（落地版：双边真实流程）
export const pickupRequests = pgTable("pickup_requests", {
  id: serial("id").primaryKey(),
  // 发单方
  publisherId: text("publisher_id").notNull(),
  publisherName: varchar("publisher_name", { length: 50 }).notNull(),
  publisherCommunity: varchar("publisher_community", { length: 100 }),
  // 孩子信息
  childName: varchar("child_name", { length: 50 }).notNull(),
  childSchool: varchar("child_school", { length: 100 }).notNull(),
  childGrade: varchar("child_grade", { length: 20 }),
  // 接送信息
  pickupTime: varchar("pickup_time", { length: 30 }).notNull(),   // "15:30"
  pickupDate: varchar("pickup_date", { length: 20 }).notNull(),   // "今天" / "2024-01-15"
  pickupLocation: varchar("pickup_location", { length: 200 }).notNull(),
  dropoffLocation: varchar("dropoff_location", { length: 200 }).notNull(),
  // AI 生成文案
  aiText: text("ai_text"),
  // 状态：pending=等待接单 / accepted=已有人接 / completed=已完成 / cancelled=已取消
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  // 接单方
  acceptorId: text("acceptor_id"),
  acceptorName: varchar("acceptor_name", { length: 50 }),
  acceptedAt: timestamp("accepted_at"),
  completedAt: timestamp("completed_at"),
  // 紧急联系
  emergencyPhone: varchar("emergency_phone", { length: 20 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type PickupRequest = InferSelectModel<typeof pickupRequests>;
