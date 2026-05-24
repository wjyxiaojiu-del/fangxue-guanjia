"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield, Sparkles, CheckCircle } from "lucide-react";
import { request } from "@/lib/api/request";
import { toast } from "sonner";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 28 };
const TAP = 0.97;

interface FormData {
  displayName: string;
  childName: string;
  childSchool: string;
  childGrade: string;
  community: string;
  phone: string;
}

export function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState<"welcome" | "form">("welcome");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>({
    displayName: "",
    childName: "",
    childSchool: "",
    childGrade: "三年级",
    community: "",
    phone: "",
  });

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.displayName || !form.childName || !form.childSchool || !form.community) {
      toast.error("请填写所有必填信息");
      return;
    }
    setSaving(true);
    try {
      const res = await request("/api/parent-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: form.displayName,
          childName: form.childName,
          childSchool: form.childSchool,
          childGrade: form.childGrade,
          community: form.community,
          phone: form.phone,
          avatarInitial: form.displayName.charAt(0),
          onboardingDone: 1,
        }),
      });
      if (!res.ok) throw new Error("保存失败");
      router.replace("/");
    } catch {
      toast.error("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  }

  const grades = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"];

  return (
    <div className="min-h-svh bg-[var(--color-accent)] flex flex-col px-6 py-8">
      <div className="max-w-sm mx-auto w-full flex flex-col flex-1">
        <AnimatePresence mode="wait">
          {step === "welcome" ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={SPRING}
              className="flex flex-col flex-1 justify-center items-center text-center space-y-8"
            >
              {/* 插画 */}
              <div className="w-44 h-44 rounded-full flex items-center justify-center relative shadow-inner"
                style={{ background: "linear-gradient(135deg, #FFF4E4, #FDF4E7)" }}>
                <div className="absolute -top-1 -right-1 w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                  style={{ background: "var(--color-primary)" }}>
                  嗨
                </div>
                <svg className="w-28 h-28" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="30" strokeDasharray="4 4" style={{ stroke: "var(--color-border)" }} />
                  <circle cx="38" cy="31" r="4" fill="var(--color-primary)" stroke="none" />
                  <path d="M38 39v15m0-15l-4-2m4 2l4-2m-4 15l-3 8m3-8l3 8" style={{ stroke: "var(--color-primary)" }} />
                  <circle cx="62" cy="45" r="3" fill="var(--color-primary)" stroke="none" />
                  <path d="M62 51v11m0-11l-3-2m3 2l3-2m-3 11l-2 6m2-6l2 6" style={{ stroke: "var(--color-primary)" }} />
                  <path d="M38 49h24" strokeDasharray="2 2" style={{ stroke: "var(--color-secondary)" }} />
                </svg>
              </div>

              {/* 文案 */}
              <div className="space-y-3">
                <h2 className="text-2xl font-black tracking-tight" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
                  下午三点 告别接娃焦虑
                </h2>
                <p className="text-xs leading-relaxed max-w-[280px] mx-auto" style={{ color: "var(--color-text-secondary)" }}>
                  专为双职工家庭设计的暖心接送互助，让每一个孩子安全放学回家。
                </p>
              </div>

              {/* 特性卡片 */}
              <div className="w-full space-y-2 max-w-[300px]">
                {[
                  { icon: Shield, bg: "#EAF5EF", color: "var(--color-states-success)", title: "邻居双向实名校验", desc: "同小区可信家长，安全可追溯" },
                  { icon: Sparkles, bg: "#FFF4E4", color: "var(--color-primary)", title: "一分钟 AI 智能匹配", desc: "精准计算顺路度，一键找到帮手" },
                ].map((item) => (
                  <div key={item.title} className="bg-white border border-[var(--color-border)] rounded-2xl p-3 flex items-center gap-3">
                    <span className="p-2 rounded-xl flex-shrink-0" style={{ background: item.bg }}>
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </span>
                    <div className="text-left">
                      <h4 className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>{item.title}</h4>
                      <p className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: TAP }}
                onClick={() => setStep("form")}
                className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
              >
                <span>开启暖心邻里互助</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={SPRING}
              className="flex flex-col flex-1 space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>填写基本信息</h2>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>让邻居更快找到你，孩子更安全</p>
              </div>

              <div className="space-y-4 flex-1">
                {/* 家长昵称 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold" style={{ color: "var(--color-text-secondary)" }}>你的昵称 *</label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={(e) => update("displayName", e.target.value)}
                    placeholder="例：小明妈妈"
                    className="w-full rounded-xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-text-primary)" }}
                  />
                </div>

                {/* 所在小区 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold" style={{ color: "var(--color-text-secondary)" }}>所在小区 *</label>
                  <input
                    type="text"
                    value={form.community}
                    onChange={(e) => update("community", e.target.value)}
                    placeholder="例：阳光花园小区"
                    className="w-full rounded-xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-text-primary)" }}
                  />
                </div>

                {/* 孩子信息 */}
                <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 space-y-3">
                  <p className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>孩子信息</p>
                  <div className="space-y-1.5">
                    <label className="text-xs" style={{ color: "var(--color-text-secondary)" }}>孩子姓名 *</label>
                    <input
                      type="text"
                      value={form.childName}
                      onChange={(e) => update("childName", e.target.value)}
                      placeholder="例：小明"
                      className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      style={{ borderColor: "var(--color-border)", background: "var(--color-accent)", color: "var(--color-text-primary)" }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs" style={{ color: "var(--color-text-secondary)" }}>就读学校 *</label>
                    <input
                      type="text"
                      value={form.childSchool}
                      onChange={(e) => update("childSchool", e.target.value)}
                      placeholder="例：阳光小学"
                      className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      style={{ borderColor: "var(--color-border)", background: "var(--color-accent)", color: "var(--color-text-primary)" }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs" style={{ color: "var(--color-text-secondary)" }}>年级</label>
                    <div className="flex flex-wrap gap-2">
                      {grades.map((g) => (
                        <motion.button
                          key={g}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => update("childGrade", g)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                          style={{
                            background: form.childGrade === g ? "var(--color-primary)" : "white",
                            color: form.childGrade === g ? "white" : "var(--color-text-secondary)",
                            borderColor: form.childGrade === g ? "var(--color-primary)" : "var(--color-border)",
                          }}
                        >
                          {g}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 联系电话 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold" style={{ color: "var(--color-text-secondary)" }}>联系电话（可选）</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="方便邻居联系你"
                    className="w-full rounded-xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-text-primary)" }}
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: TAP }}
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>完成，开始使用</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
