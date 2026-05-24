"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Plus, CheckCircle, Users, Send, Users2 } from "lucide-react";
import { useState } from "react";

const leftTabs = [{ href: "/", icon: Home, label: "广场" }];
const rightTabs = [{ href: "/status", icon: CheckCircle, label: "状态" }];

const sidebarTabs = [
  { href: "/", icon: Home, label: "需求广场" },
  { href: "/publish", icon: Send, label: "我要发单" },
  { href: "/accept", icon: Users2, label: "我要接单" },
  { href: "/status", icon: CheckCircle, label: "接送状态" },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* 遮罩层 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 弹出菜单 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 md:hidden flex flex-col items-center gap-3"
          >
            {/* 我要接单 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="bg-white rounded-2xl px-4 py-2 text-xs font-bold shadow-lg"
                style={{ color: "var(--color-text-primary)" }}>
                我要接单
              </span>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => { setMenuOpen(false); router.push("/"); }}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: "var(--color-states-success)" }}
              >
                <Users2 className="w-5 h-5 text-white" />
              </motion.button>
            </motion.div>

            {/* 我要发单 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.0 }}
              className="flex items-center gap-3"
            >
              <span className="bg-white rounded-2xl px-4 py-2 text-xs font-bold shadow-lg"
                style={{ color: "var(--color-text-primary)" }}>
                我要发单
              </span>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => { setMenuOpen(false); router.push("/publish"); }}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: "var(--color-primary)" }}
              >
                <Send className="w-5 h-5 text-white" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-[var(--color-border)] pb-[env(safe-area-inset-bottom)] z-30">
        <div className="flex items-center h-16">
          {/* 左侧：广场 */}
          {leftTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href} className="flex-1 flex flex-col items-center gap-0.5 min-h-[44px] justify-center relative">
                <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-0.5">
                  <tab.icon className="w-5 h-5" style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-muted)" }} />
                  <span className="text-[10px] font-medium" style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-muted)" }}>{tab.label}</span>
                </motion.div>
                {isActive && <motion.div layoutId="tab-bar-indicator" className="absolute -top-px left-4 right-4 h-0.5 rounded-full" style={{ background: "var(--color-primary)" }} />}
              </Link>
            );
          })}

          {/* 中间：加号大按钮（点击弹出菜单） */}
          <div className="flex-1 flex flex-col items-center gap-0.5 relative -mt-5">
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setMenuOpen((v) => !v)}
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
            >
              <motion.div
                animate={{ rotate: menuOpen ? 45 : 0 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
              >
                <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
              </motion.div>
            </motion.button>

          </div>

          {/* 右侧：状态 */}
          {rightTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href} className="flex-1 flex flex-col items-center gap-0.5 min-h-[44px] justify-center relative">
                <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-0.5">
                  <tab.icon className="w-5 h-5" style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-muted)" }} />
                  <span className="text-[10px] font-medium" style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-muted)" }}>{tab.label}</span>
                </motion.div>
                {isActive && <motion.div layoutId="tab-bar-indicator" className="absolute -top-px left-4 right-4 h-0.5 rounded-full" style={{ background: "var(--color-primary)" }} />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-[var(--color-border)] bg-white z-20">
      <div className="flex flex-col flex-1 py-6 px-4 gap-1">
        <div className="px-2 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
            <Users className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>放学帮</span>
        </div>
        {sidebarTabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--color-accent)] ${isActive ? "bg-[var(--color-accent)]" : ""}`}
              style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)" }}>
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
