import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

/**
 * POST /api/notifications/test
 * 发送测试通知（需接入微信订阅消息或第三方推送服务）
 */
export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  // TODO: 接入微信订阅消息或 WebSocket 推送
  return NextResponse.json({
    ok: true,
    message: "通知功能开发中，敬请期待",
  });
}
