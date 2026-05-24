"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Phone } from "lucide-react";
import { toast } from "sonner";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 28 };
const TAP = 0.97;

const STATUS_STEPS = [
  { key: "pending", label: "等待接单", desc: "发布中" },
  { key: "accepted", label: "邻居已接单", desc: "接送中" },
  { key: "completed", label: "安全到家", desc: "已完成" },
];

// Demo 数据
const DEMO_PUBLISHED = [
  { id: 2001, childName: "小明", childSchool: "阳光小学", pickupTime: "15:30", pickupDate: "今天", pickupLocation: "校门口大枣树旁", dropoffLocation: "阳光花园3栋", status: "accepted" as const, acceptorName: "刘晓燕", emergencyPhone: "138****8890" },
];
const DEMO_ACCEPTED = [
  { id: 1003, childName: "浩浩", childSchool: "实验第一小学", pickupTime: "15:40", pickupDate: "今天", pickupLocation: "西侧保安亭旁", dropoffLocation: "锦绣家园北门", publisherName: "王秀英", emergencyPhone: "156****4321" },
];

function getStepIndex(status: string) {
  if (status === "pending") return 0;
  if (status === "accepted") return 1;
  if (status === "completed") return 2;
  return 0;
}

export function StatusSyncScreen() {
  const [publishedStatus, setPublishedStatus] = useState<Record<number, string>>({ 2001: "accepted" });
  const [completingId, setCompletingId] = useState<number | null>(null);

  function handleComplete(id: number) {
    setCompletingId(id);
    setTimeout(() => {
      setPublishedStatus((prev) => ({ ...prev, [id]: "completed" }));
      setCompletingId(null);
      toast.success("太好了！孩子安全到家了");
    }, 1200);
  }

  const hasContent = DEMO_PUBLISHED.length > 0 || DEMO_ACCEPTED.length > 0;

  return (
    <div className="min-h-svh bg-[var(--color-accent)] pb-28 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-5">
        <div>
          <h1 className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>接送状态</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>实时追踪孩子的接送进度</p>
        </div>

        {!hasContent ? (
          <div className="bg-white border border-[var(--color-border)] rounded-3xl p-8 text-center">
            <p className="text-sm font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>还没有进行中的接送</p>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>发布需求或接单后，状态会在这里显示</p>
          </div>
        ) : (
          <>
            {/* 我发布的需求 */}
            {DEMO_PUBLISHED.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold px-1" style={{ color: "var(--color-text-secondary)" }}>我发布的需求</h2>
                {DEMO_PUBLISHED.map((req) => {
                  const currentStatus = publishedStatus[req.id] ?? req.status;
                  const stepIndex = getStepIndex(currentStatus);
                  const isCompleted = currentStatus === "completed";

                  return (
                    <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}
                      className="bg-white border border-[var(--color-border)] rounded-3xl p-5 space-y-4">
                      {/* 孩子信息 */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{req.childName}</h3>
                          <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{req.childSchool} · {req.pickupDate} {req.pickupTime}</p>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-1 rounded-lg"
                          style={{ background: isCompleted ? "#EAF5EF" : "#FFF4E4", color: isCompleted ? "var(--color-states-success)" : "var(--color-primary)" }}>
                          {isCompleted ? "已完成" : "接送中"}
                        </span>
                      </div>

                      {/* 三步进度条 */}
                      <div className="relative">
                        <div className="flex justify-between relative z-10">
                          {STATUS_STEPS.map((step, i) => {
                            const done = i <= stepIndex;
                            return (
                              <div key={step.key} className="flex flex-col items-center gap-1 flex-1">
                                <motion.div
                                  animate={{ scale: i === stepIndex ? [1, 1.15, 1] : 1 }}
                                  transition={{ repeat: i === stepIndex ? Infinity : 0, duration: 2 }}
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2"
                                  style={{
                                    background: done ? "var(--color-primary)" : "white",
                                    borderColor: done ? "var(--color-primary)" : "var(--color-border)",
                                    color: done ? "white" : "var(--color-text-muted)",
                                  }}>
                                  {done ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                                </motion.div>
                                <span className="text-[9px] text-center font-medium" style={{ color: done ? "var(--color-primary)" : "var(--color-text-muted)" }}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="absolute top-3.5 left-[16.67%] right-[16.67%] h-0.5 -z-0 rounded-full"
                          style={{ background: "var(--color-border)" }}>
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${(stepIndex / 2) * 100}%`, background: "var(--color-primary)" }} />
                        </div>
                      </div>

                      {/* 接单人信息 */}
                      {req.acceptorName && !isCompleted && (
                        <div className="rounded-2xl p-3 flex items-center gap-3"
                          style={{ background: "#F0FAF5", border: "1px solid #CDE5D8" }}>
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: "var(--color-states-success)" }}>
                            {req.acceptorName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold" style={{ color: "var(--color-states-success)" }}>
                              {req.acceptorName} 已接单，正在前往
                            </p>
                            <p className="text-[10px] mt-0.5" style={{ color: "#55846A" }}>前往 {req.pickupLocation}</p>
                          </div>
                          {req.emergencyPhone && (
                            <a href={`tel:${req.emergencyPhone}`}
                              className="w-8 h-8 rounded-xl flex items-center justify-center border flex-shrink-0"
                              style={{ borderColor: "var(--color-border)", background: "white" }}>
                              <Phone className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
                            </a>
                          )}
                        </div>
                      )}

                      {/* 打卡按钮 */}
                      {!isCompleted && currentStatus === "accepted" && (
                        <motion.button whileTap={{ scale: TAP }}
                          onClick={() => handleComplete(req.id)}
                          disabled={completingId === req.id}
                          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                          style={{ background: "linear-gradient(135deg, var(--color-states-success), #3d8a62)" }}>
                          {completingId === req.id ? (
                            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              孩子已安全到家，打卡确认
                            </>
                          )}
                        </motion.button>
                      )}
                      {isCompleted && (
                        <div className="w-full py-3 rounded-2xl text-center font-bold text-sm"
                          style={{ background: "#EAF5EF", color: "var(--color-states-success)" }}>
                          孩子已安全到家
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* 我接的单 */}
            {DEMO_ACCEPTED.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold px-1" style={{ color: "var(--color-text-secondary)" }}>我正在帮忙接的孩子</h2>
                {DEMO_ACCEPTED.map((req) => (
                  <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING, delay: 0.1 }}
                    className="bg-white border border-[var(--color-border)] rounded-3xl p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{req.childName}</h3>
                        <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{req.childSchool} · {req.pickupDate} {req.pickupTime}</p>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-1 rounded-lg"
                        style={{ background: "#FFF4E4", color: "var(--color-primary)" }}>进行中</span>
                    </div>
                    <div className="rounded-2xl p-3 space-y-1" style={{ background: "#FFFBF4", border: "1px solid var(--color-border)" }}>
                      <div className="flex justify-between text-[10px]">
                        <span style={{ color: "var(--color-text-secondary)" }}>接孩子地点</span>
                        <span className="font-bold" style={{ color: "var(--color-text-primary)" }}>{req.pickupLocation}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span style={{ color: "var(--color-text-secondary)" }}>送达地点</span>
                        <span className="font-bold" style={{ color: "var(--color-text-primary)" }}>{req.dropoffLocation}</span>
                      </div>
                    </div>
                    {req.emergencyPhone && (
                      <a href={`tel:${req.emergencyPhone}`}
                        className="w-full py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2"
                        style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)", background: "white" }}>
                        <Phone className="w-3.5 h-3.5" />
                        联系 {req.publisherName}（发单家长）
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* 紧急联系 */}
            <div className="rounded-3xl p-4 space-y-3" style={{ background: "#FFF5F5", border: "1px solid #FAD9D9" }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" style={{ color: "var(--color-states-error)" }} />
                <h3 className="text-xs font-bold" style={{ color: "var(--color-states-error)" }}>紧急情况</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[{ label: "110 报警求助", tel: "110" }, { label: "120 急救电话", tel: "120" }].map((item) => (
                  <a key={item.tel} href={`tel:${item.tel}`}
                    className="bg-white border rounded-xl p-2.5 text-[10px] font-bold flex items-center justify-between"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}>
                    <span>{item.label}</span>
                    <Phone className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
