import { type NextRequest, NextResponse } from "next/server";

/**
 * GET /api/notifications/cron/daily-digest
 * 每日摘要定时任务（由 vercel.json crons 或外部 cron 触发）
 */
export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 }
    );
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // TODO: 实现每日摘要推送逻辑
  return NextResponse.json({
    ok: true,
    message: "每日摘要功能开发中",
  });
}
