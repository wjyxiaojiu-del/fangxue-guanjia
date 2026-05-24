"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Phone, MessageCircle, CheckCircle, Home } from "lucide-react";
import { toast } from "sonner";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 28 };
const TAP = 0.97;

const DEMO_DATA: Record<number, {
  id: number; publisherName: string; publisherCommunity: string;
  childName: string; childSchool: string; childGrade: string;
  pickupTime: string; pickupDate: string; pickupLocation: string; dropoffLocation: string;
  emergencyPhone: string; matchScore: number;
  avatarBg: string; avatarColor: string;
}> = {
  1001: { id: 1001, publisherName: "张慧芳", publisherCommunity: "阳光花园", childName: "小明", childSchool: "阳光小学", childGrade: "三年级", pickupTime: "15:30", pickupDate: "今天", pickupLocation: "校门口大枣树旁", dropoffLocation: "阳光花园3栋", emergencyPhone: "138****2301", matchScore: 98, avatarBg: "#FFF4E4", avatarColor: "var(--color-primary)" },
  1002: { id: 1002, publisherName: "李建国", publisherCommunity: "水岸华庭", childName: "欢欢", childSchool: "阳光小学", childGrade: "二年级", pickupTime: "15:20", pickupDate: "今天", pickupLocation: "北门人行道牌", dropoffLocation: "水岸华庭5栋", emergencyPhone: "139****5678", matchScore: 92, avatarBg: "#FFF9ED", avatarColor: "#E08A27" },
  1003: { id: 1003, publisherName: "王秀英", publisherCommunity: "锦绣家园", childName: "浩浩", childSchool: "实验第一小学", childGrade: "一年级", pickupTime: "15:40", pickupDate: "今天", pickupLocation: "西侧保安亭旁", dropoffLocation: "锦绣家园北门", emergencyPhone: "156****4321", matchScore: 85, avatarBg: "#F0FAF5", avatarColor: "var(--color-states-success)" },
  1004: { id: 1004, publisherName: "陈伟", publisherCommunity: "金地格林", childName: "乐乐", childSchool: "实验第一小学", childGrade: "四年级", pickupTime: "15:15", pickupDate: "今天", pickupLocation: "东门花坛旁", dropoffLocation: "金地格林2栋", emergencyPhone: "187****6543", matchScore: 79, avatarBg: "#F0F4FF", avatarColor: "#6B7FF0" },
  1005: { id: 1005, publisherName: "刘晓燕", publisherCommunity: "阳光花园", childName: "思远", childSchool: "阳光小学", childGrade: "五年级", pickupTime: "15:30", pickupDate: "今天", pickupLocation: "校门口大枣树旁", dropoffLocation: "阳光花园8栋", emergencyPhone: "133****8890", matchScore: 96, avatarBg: "#FFF0F5", avatarColor: "#E06B8A" },
};

export function RequestDetailScreen({ requestId }: { requestId: number }) {
  const router = useRouter();
  const req = DEMO_DATA[requestId] ?? null;
  const [accepted, setAccepted] = useState(false);
  const [accepting, setAccepting] = useState(false);

  function handleAccept() {
    setAccepting(true);
    setTimeout(() => {
      setAccepted(true);
      setAccepting(false);
      toast.success("接单成功！记得准时到达");
    }, 1000);
  }

  if (!req) return (
    <div className="min-h-svh bg-[var(--color-accent)] flex flex-col items-center justify-center gap-3 p-8">
      <p className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>找不到这条需求</p>
      <button onClick={() => router.back()} className="text-xs px-4 py-2 rounded-xl border"
        style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>返回广场</button>
    </div>
  );

  return (
    <div className="min-h-svh bg-[var(--color-accent)] pb-28 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">

        {/* 顶部导航 */}
        <div className="flex items-center justify-between pb-1">
          <motion.button whileTap={{ scale: TAP }} onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold py-1"
            style={{ color: "var(--color-text-secondary)" }}>
            <ArrowLeft className="w-3.5 h-3.5" />
            返回需求广场
          </motion.button>
          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            互助编号 #{String(req.id).padStart(6, "0")}
          </span>
        </div>

        {/* 发单人卡片 */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}
          className="bg-white border border-[var(--color-border)] rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0"
              style={{ background: req.avatarBg, color: req.avatarColor, fontFamily: "var(--font-heading)" }}>
              {req.publisherName.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{req.publisherName}</h2>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                {req.publisherCommunity} · {req.childName}的家长
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                {req.childSchool} {req.childGrade}
              </p>
            </div>
            <div className="ml-auto text-right">
              <span className="text-[9px] block" style={{ color: "var(--color-text-muted)" }}>顺路度</span>
              <span className="text-xl font-bold" style={{ color: "var(--color-primary)", fontFamily: "var(--font-heading)" }}>
                {req.matchScore}%
              </span>
            </div>
          </div>
          {/* 进度条 */}
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#FAF5EB" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${req.matchScore}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }} />
          </div>
        </motion.div>

        {/* 安全认证 */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.07 }}
          className="border rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ background: "#EAF5EF", borderColor: "#CDE5D8" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0"
            style={{ background: "var(--color-states-success)" }}>
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold" style={{ color: "var(--color-states-success)" }}>邻里互助安全保障已开启</h4>
            <p className="text-[10px] mt-0.5" style={{ color: "#55846A" }}>
              发单家长来自 {req.publisherCommunity}，信息已记录可追溯
            </p>
          </div>
        </motion.div>

        {/* 接送路线 */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.12 }}
          className="bg-white rounded-3xl p-4 border border-[var(--color-border)] space-y-3">
          <h4 className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>接送路线</h4>
          <div className="relative py-4 flex items-center justify-between px-8 rounded-2xl border"
            style={{ background: "#FFFDF9", borderColor: "var(--color-border)" }}>
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-px border-t-2 border-dashed"
              style={{ borderColor: "var(--color-border)" }} />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-sm"
                style={{ background: "#FFF4E4", borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                <svg fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="m4 6 8-4 8 4v10l-8 4-8-4z" />
                </svg>
              </div>
              <span className="text-[9px] font-bold text-center max-w-[60px]" style={{ color: "var(--color-text-primary)" }}>
                {req.childSchool.slice(0, 4)}
              </span>
            </div>
            <div className="absolute left-[45%] top-1/2 -translate-y-[18px] z-20 bg-white border rounded-full p-1 shadow-sm"
              style={{ borderColor: "var(--color-border)" }}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                style={{ color: "var(--color-primary)" }}>
                <rect width="15" height="13" x="1" y="3" /><path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-sm"
                style={{ background: "#EAF5EF", borderColor: "var(--color-states-success)", color: "var(--color-states-success)" }}>
                <Home className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-bold text-center max-w-[60px]" style={{ color: "var(--color-text-primary)" }}>
                {req.publisherCommunity.slice(0, 4)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="rounded-xl p-2.5" style={{ background: "var(--color-accent)", border: "1px solid var(--color-border)" }}>
              <span style={{ color: "var(--color-text-muted)" }}>接孩子地点</span>
              <p className="font-bold mt-0.5" style={{ color: "var(--color-text-primary)" }}>{req.pickupLocation}</p>
            </div>
            <div className="rounded-xl p-2.5" style={{ background: "var(--color-accent)", border: "1px solid var(--color-border)" }}>
              <span style={{ color: "var(--color-text-muted)" }}>送达地点</span>
              <p className="font-bold mt-0.5" style={{ color: "var(--color-text-primary)" }}>{req.dropoffLocation}</p>
            </div>
          </div>
        </motion.div>

        {/* 时间约定 */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.16 }}
          className="bg-white rounded-3xl p-5 border border-[var(--color-border)] space-y-4">
          <h3 className="text-xs font-bold" style={{ color: "var(--color-text-secondary)" }}>今日代接时间约定</h3>
          <div className="space-y-4 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-[var(--color-border)] before:content-['']">
            {[
              { time: `${req.pickupDate} ${req.pickupTime} 前`, label: "出发前往学校", desc: `前往 ${req.pickupLocation}`, color: "var(--color-primary)" },
              { time: req.pickupTime, label: req.pickupLocation, desc: `接到 ${req.childName}，核对信息`, color: "var(--color-secondary)" },
              { time: "送达", label: req.dropoffLocation, desc: "安全到达，打卡确认", color: "var(--color-states-success)" },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col gap-1 pl-4">
                <div className="absolute -left-[14px] top-1 w-2 h-2 rounded-full ring-4 ring-white"
                  style={{ background: step.color }} />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold" style={{ color: "var(--color-text-primary)" }}>{step.time}</span>
                  <span className="text-[9px] font-bold" style={{ color: step.color }}>{step.label}</span>
                </div>
                <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 行动按钮 */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.2 }}
          className="grid grid-cols-2 gap-3">
          <motion.a whileTap={{ scale: TAP }} href={`tel:${req.emergencyPhone}`}
            className="py-3.5 bg-white border rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5"
            style={{ borderColor: "var(--color-border)", color: "var(--color-primary)" }}>
            <Phone className="w-3.5 h-3.5" />
            联系家长
          </motion.a>
          {accepted ? (
            <div className="py-3.5 rounded-2xl text-white text-xs font-bold flex items-center justify-center gap-1.5"
              style={{ background: "var(--color-states-success)" }}>
              <CheckCircle className="w-3.5 h-3.5" />
              已接单
            </div>
          ) : (
            <motion.button whileTap={{ scale: TAP }} onClick={handleAccept} disabled={accepting}
              className="py-3.5 rounded-2xl text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}>
              {accepting
                ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <><MessageCircle className="w-3.5 h-3.5" />我来接这个孩子</>
              }
            </motion.button>
          )}
        </motion.div>

      </div>
    </div>
  );
}
