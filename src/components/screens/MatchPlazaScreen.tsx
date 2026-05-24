"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, RefreshCw, MapPin } from "lucide-react";
import Link from "next/link";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 28 };
const TAP = 0.97;

const DEMO_REQUESTS = [
  { id: 1001, publisherName: "张慧芳", publisherCommunity: "阳光花园", childName: "小明", childSchool: "阳光小学", childGrade: "三年级", pickupTime: "15:30", pickupDate: "今天", pickupLocation: "校门口大枣树旁", dropoffLocation: "阳光花园3栋", matchScore: 98, avatarBg: "#FFF4E4", avatarColor: "var(--color-primary)", postedAgo: "8分钟前" },
  { id: 1002, publisherName: "李建国", publisherCommunity: "水岸华庭", childName: "欢欢", childSchool: "阳光小学", childGrade: "二年级", pickupTime: "15:20", pickupDate: "今天", pickupLocation: "北门人行道牌", dropoffLocation: "水岸华庭5栋", matchScore: 92, avatarBg: "#FFF9ED", avatarColor: "#E08A27", postedAgo: "15分钟前" },
  { id: 1003, publisherName: "王秀英", publisherCommunity: "锦绣家园", childName: "浩浩", childSchool: "实验第一小学", childGrade: "一年级", pickupTime: "15:40", pickupDate: "今天", pickupLocation: "西侧保安亭旁", dropoffLocation: "锦绣家园北门", matchScore: 85, avatarBg: "#F0FAF5", avatarColor: "var(--color-states-success)", postedAgo: "32分钟前" },
  { id: 1004, publisherName: "陈伟", publisherCommunity: "金地格林", childName: "乐乐", childSchool: "实验第一小学", childGrade: "四年级", pickupTime: "15:15", pickupDate: "今天", pickupLocation: "东门花坛旁", dropoffLocation: "金地格林2栋", matchScore: 79, avatarBg: "#F0F4FF", avatarColor: "#6B7FF0", postedAgo: "1小时前" },
  { id: 1005, publisherName: "刘晓燕", publisherCommunity: "阳光花园", childName: "思远", childSchool: "阳光小学", childGrade: "五年级", pickupTime: "15:30", pickupDate: "今天", pickupLocation: "校门口大枣树旁", dropoffLocation: "阳光花园8栋", matchScore: 96, avatarBg: "#FFF0F5", avatarColor: "#E06B8A", postedAgo: "3分钟前" },
];

export function MatchPlazaScreen() {
  const [accepted, setAccepted] = useState<number[]>([]);
  const [refreshAnim, setRefreshAnim] = useState(false);

  function handleAccept(id: number) {
    setAccepted((prev) => [...prev, id]);
  }

  function handleRefresh() {
    setRefreshAnim(true);
    setTimeout(() => setRefreshAnim(false), 800);
  }

  const schools = [...new Set(DEMO_REQUESTS.map((r) => r.childSchool))];

  return (
    <div className="min-h-svh bg-[var(--color-accent)] pb-28 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold" style={{ color: "var(--color-primary)", fontFamily: "var(--font-heading)" }}>放学帮</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "#FFF4E4", color: "var(--color-secondary)" }}>邻里互助</span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>附近等待好邻居帮忙的孩子</p>
          </div>
          <motion.button whileTap={{ scale: TAP }} onClick={handleRefresh}
            className="flex items-center gap-1 text-xs font-bold border rounded-lg px-2.5 py-1"
            style={{ color: "var(--color-primary)", borderColor: "var(--color-border)", background: "white" }}>
            <RefreshCw className={`w-3 h-3 ${refreshAnim ? "animate-spin" : ""}`} />
            刷新
          </motion.button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {schools.map((school) => (
            <span key={school} className="flex-shrink-0 bg-white border border-[var(--color-border)] rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ color: "var(--color-text-primary)" }}>{school}</span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold" style={{ color: "var(--color-text-secondary)" }}>共 {DEMO_REQUESTS.length} 条待接单需求</h3>
          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>实时更新</span>
        </div>

        <div className="space-y-3.5">
          {DEMO_REQUESTS.map((req, index) => {
            const isAccepted = accepted.includes(req.id);
            return (
              <motion.div key={req.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: index * 0.05 }}>
                <Link href={`/requests/${req.id}`}>
                  <motion.div whileTap={{ scale: 0.98 }} whileHover={{ borderColor: "var(--color-primary)" }}
                    className="bg-white rounded-3xl p-4 border border-[var(--color-border)] space-y-3.5 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                          style={{ background: req.avatarBg, color: req.avatarColor, fontFamily: "var(--font-heading)" }}>
                          {req.publisherName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>
                              {req.publisherName}（{req.childName}的家长）
                            </h4>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-states-success)" }} />
                          </div>
                          <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: "var(--color-text-secondary)" }}>
                            <MapPin className="w-2.5 h-2.5" style={{ color: "var(--color-primary)" }} />
                            <span className="font-semibold px-1 rounded" style={{ color: "var(--color-primary)", background: "#FFF4E4" }}>
                              {req.publisherCommunity}
                            </span>
                            · {req.childSchool} · {req.childGrade}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-[9px] block" style={{ color: "var(--color-text-muted)" }}>顺路度</span>
                        <span className="text-base font-bold" style={{ color: "var(--color-primary)", fontFamily: "var(--font-heading)" }}>
                          {req.matchScore}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "#FAF5EB" }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${req.matchScore}%` }}
                          transition={{ delay: index * 0.05 + 0.2, duration: 0.6, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }} />
                      </div>
                      <div className="flex justify-between text-[9px]" style={{ color: "var(--color-text-muted)" }}>
                        <span>接：{req.pickupLocation}</span>
                        <span>送：{req.dropoffLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t" style={{ borderColor: "#FAF5EC" }}>
                      <div className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                        {req.pickupDate} {req.pickupTime} · {req.postedAgo}
                      </div>
                      {isAccepted ? (
                        <div className="text-xs font-bold px-3 py-1.5 rounded-xl text-white flex items-center gap-1"
                          style={{ background: "var(--color-states-success)" }}>已接单 ✓</div>
                      ) : (
                        <motion.button whileTap={{ scale: TAP }}
                          onClick={(e) => { e.preventDefault(); handleAccept(req.id); }}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1"
                          style={{ background: "#FFF4E4", color: "var(--color-primary)", borderColor: "#FAECD7" }}>
                          我来接 <ChevronRight className="w-3 h-3" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
