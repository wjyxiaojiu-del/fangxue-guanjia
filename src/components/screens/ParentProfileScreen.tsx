"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Edit, LogIn } from "lucide-react";
import { request } from "@/lib/api/request";
import { useState, useEffect } from "react";
import type { ParentProfile } from "@/lib/db/schema/parent-profiles";
import Link from "next/link";
import { UserBadge } from "@/components/user-profile/user-badge";
import { fetchUserProfile } from "@/lib/api/user-profile";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 28 };

export function ParentProfileScreen() {
  const [user, setUser] = useState<{ id: string; name?: string } | null>(null);
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const u = await fetchUserProfile();
      setUser(u);
      if (!u) { setLoading(false); return; }
      try {
        const res = await request("/api/parent-profile");
        if (res.ok) setProfile(await res.json());
      } catch {
        // 静默
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (!user) {
    return (
      <div className="min-h-svh bg-[var(--color-accent)] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: "#FFF4E4" }}>
            <LogIn className="w-8 h-8" style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>登录后查看个人主页</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>管理孩子信息、查看互助记录</p>
          </div>
          <UserBadge />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-svh bg-[var(--color-accent)] p-4 space-y-4">
        <div className="bg-white rounded-3xl p-5 border border-[var(--color-border)] space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-200 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.displayName ?? user.name ?? "家长";
  const initial = displayName.charAt(0);
  const trustScore = profile?.trustScore ?? 100;
  const helpCount = profile?.helpCount ?? 0;
  const requestCount = profile?.requestCount ?? 0;

  return (
    <div className="min-h-svh bg-[var(--color-accent)] pb-28 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
            我的主页
          </h1>
          <Link href="/onboarding">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border"
              style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-text-secondary)" }}
            >
              <Edit className="w-3.5 h-3.5" />
              编辑资料
            </motion.button>
          </Link>
        </div>

        {/* 身份卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="bg-white rounded-3xl p-5 border border-[var(--color-border)] space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl text-white font-bold text-lg flex items-center justify-center shadow-md flex-shrink-0"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", fontFamily: "var(--font-heading)" }}>
              {initial}
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
                {displayName}
              </h3>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                {profile?.community ?? "所在小区未填写"}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                {helpCount >= 10 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: "#EAF5EF", color: "var(--color-states-success)" }}>
                    五星邻居
                  </span>
                )}
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: "#FFF4E4", color: "var(--color-primary)" }}>
                  互助家长
                </span>
              </div>
            </div>
          </div>

          {/* 数据统计 */}
          <div className="grid grid-cols-3 gap-3 border-t pt-4" style={{ borderColor: "#FAF3E6" }}>
            {[
              { label: "互助积分", value: trustScore * 10, suffix: " pt" },
              { label: "接单次数", value: helpCount, suffix: " 次" },
              { label: "发单次数", value: requestCount, suffix: " 次" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="block text-[9px]" style={{ color: "var(--color-text-muted)" }}>{stat.label}</span>
                <span className="text-lg font-bold" style={{ color: "var(--color-primary)", fontFamily: "var(--font-heading)" }}>
                  {stat.value.toLocaleString("zh-CN")}{stat.suffix}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 孩子信息卡片 */}
        {profile?.childName && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.06 }}
            className="bg-white rounded-3xl p-4 border border-[var(--color-border)] space-y-3"
          >
            <h4 className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>孩子信息</h4>
            <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "#FFFDF9", border: "1px solid var(--color-border)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                style={{ background: "#FFF4E4", color: "var(--color-primary)", fontFamily: "var(--font-heading)" }}>
                {profile.childName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{profile.childName}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                  {profile.childSchool ?? "学校未填写"} · {profile.childGrade ?? ""}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 安全认证 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.1 }}
          className="bg-white rounded-3xl p-4 border border-[var(--color-border)] space-y-3"
        >
          <h4 className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>平台安全准入状态</h4>
          <div className="space-y-2">
            {[
              { icon: Shield, label: "社区实名认证", status: "已通过" },
              { icon: CheckCircle, label: "家长身份确认", status: profile ? "已绑定" : "待完善" },
              { icon: CheckCircle, label: "孩子信息登记", status: profile?.childName ? "已完成" : "待填写" },
            ].map((item) => (
              <div key={item.label}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs border"
                style={{ background: "#FAFDFC", borderColor: "#E4EEED" }}>
                <div className="flex items-center gap-2">
                  <item.icon className="w-3.5 h-3.5" style={{ color: "var(--color-states-success)" }} />
                  <span className="font-bold" style={{ color: "var(--color-text-primary)" }}>{item.label}</span>
                </div>
                <span className="text-[10px] font-bold" style={{ color: "var(--color-states-success)" }}>{item.status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 无资料时引导去填写 */}
        {!profile && (
          <Link href="/onboarding">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="rounded-3xl p-4 border text-center cursor-pointer"
              style={{ background: "#FFF4E4", borderColor: "#FBEAD4" }}
            >
              <p className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>完善个人资料</p>
              <p className="text-xs mt-1" style={{ color: "var(--color-secondary)" }}>填写孩子和小区信息，让邻居找到你</p>
            </motion.div>
          </Link>
        )}

      </div>
    </div>
  );
}
