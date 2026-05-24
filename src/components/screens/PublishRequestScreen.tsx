"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, Send, Shield } from "lucide-react";
import { toast } from "sonner";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 28 };
const TAP = 0.97;

const PICKUP_DATES = ["今天", "明天", "后天"];
const PICKUP_TIMES = ["14:30", "15:00", "15:20", "15:30", "15:40", "16:00"];

export function PublishRequestScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    childName: "",
    childSchool: "",
    childGrade: "",
    pickupDate: "今天",
    pickupTime: "15:30",
    pickupLocation: "",
    dropoffLocation: "",
    emergencyPhone: "",
  });
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (["childName", "childSchool", "pickupTime", "pickupLocation"].includes(field)) {
      setAiText("");
    }
  }

  async function handleSubmit() {
    if (!form.childName || !form.childSchool || !form.pickupLocation || !form.dropoffLocation) {
      toast.error("请填写孩子姓名、学校、接送地点");
      return;
    }
    setSubmitting(true);
    setAiLoading(true);
    setAiText("");

    // Demo 模式：直接生成模拟文案，无需登录
    setSubmitting(true);
    setAiLoading(true);
    try {
      // 模拟流式打字效果
      const demoText = `各位邻居好，我是${form.childSchool}${form.childGrade ? form.childGrade : ""}${form.childName}的家长。今天${form.pickupDate}${form.pickupTime}因临时有事，无法准时接孩子，孩子会在${form.pickupLocation}等候，需要送到${form.dropoffLocation}。有顺路的好邻居能帮忙吗？万分感谢！`;

      let current = "";
      for (let i = 0; i < demoText.length; i++) {
        await new Promise((r) => setTimeout(r, 30));
        current += demoText[i];
        setAiText(current);
        if (i === 0) setAiLoading(false);
      }

      setRequestId(Math.floor(Math.random() * 9000) + 1000);
      toast.success("需求已发布！等待好邻居响应");
    } catch {
      toast.error("生成失败，请重试");
      setAiLoading(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopy() {
    if (!aiText) return;
    await navigator.clipboard.writeText(aiText);
    setCopied(true);
    toast.success("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleGoToPlaza() {
    router.push("/");
  }

  const canSubmit = !!form.childName && !!form.childSchool && !!form.pickupLocation && !!form.dropoffLocation;

  return (
    <div className="min-h-svh bg-[var(--color-accent)] pb-28 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">

        {/* Header */}
        <div>
          <h1 className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
            发布接送需求
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            填写信息，AI 自动生成求助文案，一键发给家长群
          </p>
        </div>

        {/* 表单卡片 */}
        <div className="bg-white rounded-3xl p-5 border border-[var(--color-border)] space-y-4">
          <div className="border-b pb-3 flex items-center justify-between" style={{ borderColor: "#FAF3E6" }}>
            <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
              今日放学代接需求
            </h3>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#FFF4E4", color: "var(--color-primary)" }}>
              当天有效
            </span>
          </div>

          <div className="space-y-4">
            {/* 孩子姓名 */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                孩子姓名 *
              </label>
              <input
                type="text"
                value={form.childName}
                onChange={(e) => update("childName", e.target.value)}
                placeholder="例：小睿（三年级一班）"
                className="w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition-all"
                style={{ background: "#FFFDF9", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}
              />
            </div>

            {/* 学校 */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                就读学校 *
              </label>
              <input
                type="text"
                value={form.childSchool}
                onChange={(e) => update("childSchool", e.target.value)}
                placeholder="请输入孩子就读学校"
                className="w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition-all"
                style={{ background: "#FFFDF9", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}
              />
            </div>

            {/* 日期 + 时间 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>接送日期</label>
                <div className="flex gap-1.5">
                  {PICKUP_DATES.map((d) => (
                    <motion.button
                      key={d}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => update("pickupDate", d)}
                      className="flex-1 py-2 rounded-lg text-xs font-medium border transition-colors"
                      style={{
                        background: form.pickupDate === d ? "var(--color-primary)" : "white",
                        color: form.pickupDate === d ? "white" : "var(--color-text-secondary)",
                        borderColor: form.pickupDate === d ? "var(--color-primary)" : "var(--color-border)",
                      }}
                    >
                      {d}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>放学时间</label>
                <div className="grid grid-cols-3 gap-1">
                  {PICKUP_TIMES.map((t) => (
                    <motion.button
                      key={t}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => update("pickupTime", t)}
                      className="py-1.5 rounded-lg text-[10px] font-medium border transition-colors"
                      style={{
                        background: form.pickupTime === t ? "var(--color-primary)" : "white",
                        color: form.pickupTime === t ? "white" : "var(--color-text-secondary)",
                        borderColor: form.pickupTime === t ? "var(--color-primary)" : "var(--color-border)",
                      }}
                    >
                      {t}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* 接送地点 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  校门口接头地点 *
                </label>
                <input
                  type="text"
                  value={form.pickupLocation}
                  onChange={(e) => update("pickupLocation", e.target.value)}
                  placeholder="校门口西侧保安亭旁"
                  className="w-full rounded-xl border px-3 py-2.5 text-xs outline-none"
                  style={{ background: "#FFFDF9", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  送达地点 *
                </label>
                <input
                  type="text"
                  value={form.dropoffLocation}
                  onChange={(e) => update("dropoffLocation", e.target.value)}
                  placeholder="小区门口 / 家楼下"
                  className="w-full rounded-xl border px-3 py-2.5 text-xs outline-none"
                  style={{ background: "#FFFDF9", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}
                />
              </div>
            </div>

            {/* 紧急电话（可选） */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                紧急联系电话（可选）
              </label>
              <input
                type="tel"
                value={form.emergencyPhone}
                onChange={(e) => update("emergencyPhone", e.target.value)}
                placeholder="方便接单邻居直接联系你"
                className="w-full rounded-xl border px-3.5 py-3 text-sm outline-none"
                style={{ background: "#FFFDF9", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}
              />
            </div>
          </div>

          {/* AI 文案区域 */}
          <AnimatePresence>
            {(aiLoading || aiText) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={SPRING}
                className="rounded-2xl p-4 space-y-2.5 overflow-hidden"
                style={{ background: "#FFFDF9", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--color-primary)" }}>
                    <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? "animate-pulse" : ""}`} />
                    AI 自动生成邻里求助信
                  </span>
                  {aiText && (
                    <motion.button
                      whileTap={{ scale: TAP }}
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border"
                      style={{ background: "#FFF4E4", color: "var(--color-primary)", borderColor: "#FBEAD4" }}
                    >
                      {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                      {copied ? "已复制" : "一键复制"}
                    </motion.button>
                  )}
                </div>
                <div className="rounded-xl p-2.5 border min-h-[60px]"
                  style={{ background: "rgba(255,255,255,0.7)", borderColor: "#FEF3DC" }}>
                  {aiLoading && !aiText ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                            style={{ background: "var(--color-primary)", animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>AI 正在生成文案…</span>
                    </div>
                  ) : (
                    <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                      {aiText}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 提交按钮 */}
          {!requestId ? (
            <motion.button
              whileTap={{ scale: TAP }}
              onClick={handleSubmit}
              disabled={submitting || !canSubmit}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  立即向周边邻居广播
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: TAP }}
              onClick={handleGoToPlaza}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md"
              style={{ background: "var(--color-states-success)" }}
            >
              <Check className="w-4 h-4" />
              需求已发布，去看谁来接
            </motion.button>
          )}
        </div>

        {/* 安全提示 */}
        <div className="rounded-3xl p-4 flex items-start gap-3 border"
          style={{ background: "#F2FAF5", borderColor: "#E1EDE6" }}>
          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--color-states-success)" }} />
          <div className="space-y-1">
            <h4 className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>互助公约与安全提示</h4>
            <p className="text-[10px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              接单邻居均来自同小区真实家长，接送过程有记录可追溯。请在接头时向邻居说明孩子特征，并及时确认接到消息。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
