"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { LogOut, UserRound, X } from "lucide-react";
import { fetchUserProfile, type UserProfile } from "@/lib/api/user-profile";

export function UserBadge() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserProfile()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleLogout() {
    localStorage.removeItem("fx_token");
    localStorage.removeItem("fx_user");
    setUser(null);
    setOpen(false);
  }

  if (loading) {
    return (
      <div className="flex h-9 items-center rounded-full border border-border bg-background px-3 shadow-sm">
        <div className="size-4 animate-spin rounded-full border-2 border-muted border-t-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm">
        <UserRound className="h-4 w-4 text-muted-foreground" />
        <span>未登录</span>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1.5 text-sm shadow-sm transition-shadow hover:shadow-md"
      >
        <Avatar user={user} size={24} />
        <span className="max-w-[120px] truncate font-medium text-foreground">
          {user.name ?? user.id}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <div className="flex items-start justify-between gap-3 px-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar user={user} size={40} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name ?? "—"}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-0.5 shrink-0 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="shrink-0 text-muted-foreground/70">User ID</span>
              <span className="truncate text-right text-foreground font-mono">{user.id}</span>
            </div>
          </div>
          <div className="border-t border-border px-4 py-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Avatar({ user, size }: { user: UserProfile; size: number }) {
  if (user.avatarUrl) {
    const avatarSrc = user.avatarUrl.startsWith("//")
      ? `https:${user.avatarUrl}`
      : user.avatarUrl;
    return (
      <Image
        src={avatarSrc}
        alt={user.name ?? "avatar"}
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-border"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {(user.name ?? "?")[0].toUpperCase()}
    </div>
  );
}
