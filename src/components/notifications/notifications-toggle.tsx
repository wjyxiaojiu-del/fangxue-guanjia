"use client";

/**
 * 通知开关组件（需接入微信订阅消息或 WebSocket 推送）
 * 当前为占位实现
 */
export function NotificationsToggle() {
  return (
    <div className="mb-4 flex flex-col gap-2 rounded-[14px] border border-white/70 bg-white/60 p-3 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-slate-950/5">
          <span className="text-slate-950/40">🔔</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-950/80">
            接单通知
          </p>
          <p className="text-[12px] text-slate-950/45">
            通知功能开发中，敬请期待
          </p>
        </div>
      </div>
    </div>
  );
}
