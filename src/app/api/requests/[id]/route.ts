import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getRequestById, acceptRequest, completeRequest, cancelRequest, updateAiText } from "@/lib/db/queries/pickup-requests";
import { getParentProfile, incrementHelpCount } from "@/lib/db/queries/parent-profiles";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const record = await getRequestById(Number(id));
  if (!record) return NextResponse.json({ error: "未找到" }, { status: 404 });
  return NextResponse.json(record);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { id: userId, name: userName } = auth.user;
  const { id } = await params;
  const body = await request.json();
  const reqId = Number(id);

  // 接单
  if (body.action === "accept") {
    const profile = await getParentProfile(userId);
    const acceptorName = profile?.displayName ?? userName ?? "邻居家长";
    const updated = await acceptRequest(reqId, userId, acceptorName);
    if (!updated) return NextResponse.json({ error: "抢单失败，可能已被他人接单" }, { status: 409 });
    await incrementHelpCount(userId).catch(() => {});
    return NextResponse.json(updated);
  }

  // 完成打卡
  if (body.action === "complete") {
    const updated = await completeRequest(reqId, userId);
    if (!updated) return NextResponse.json({ error: "操作失败" }, { status: 400 });
    return NextResponse.json(updated);
  }

  // 取消
  if (body.action === "cancel") {
    await cancelRequest(reqId, userId);
    return NextResponse.json({ ok: true });
  }

  // 更新 AI 文案
  if (body.aiText !== undefined) {
    await updateAiText(reqId, body.aiText);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "无效操作" }, { status: 400 });
}
