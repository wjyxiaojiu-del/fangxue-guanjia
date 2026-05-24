import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { upsertUser } from "@/lib/db/queries";

/**
 * GET /api/user/profile
 * 返回当前认证用户的资料，同时确保用户记录存在于本地 DB。
 */
export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const { user } = auth;

  // Upsert in the background — don't block the response on DB latency.
  upsertUser({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  }).catch((err) => {
    console.error("[profile] upsertUser failed", err);
  });

  return NextResponse.json({ ok: true, user });
}
