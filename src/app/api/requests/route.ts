import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getPlazaRequests, createPickupRequest } from "@/lib/db/queries/pickup-requests";
import { getParentProfile, incrementRequestCount } from "@/lib/db/queries/parent-profiles";

const AI_BASE_URL = process.env.AI_BASE_URL ?? "https://api.deepseek.com/v1";
const AI_API_KEY = process.env.AI_API_KEY ?? "";
const AI_MODEL = process.env.AI_MODEL ?? "deepseek-chat";

// 需求广场：获取所有待接单需求
export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { id: userId } = auth.user;
  const requests = await getPlazaRequests(userId);
  return NextResponse.json(requests);
}

// 发布新需求（带流式 AI 文案生成）
export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { id: userId } = auth.user;

  const body = await request.json();
  const { childName, childSchool, childGrade, pickupTime, pickupDate, pickupLocation, dropoffLocation, emergencyPhone } = body;

  if (!childName || !childSchool || !pickupTime || !pickupDate || !pickupLocation || !dropoffLocation) {
    return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
  }

  // 获取发单人资料
  const profile = await getParentProfile(userId);
  const publisherName = profile?.displayName ?? "家长";
  const publisherCommunity = profile?.community;

  // 先创建记录
  const record = await createPickupRequest({
    publisherId: userId,
    publisherName,
    publisherCommunity: publisherCommunity ?? undefined,
    childName,
    childSchool,
    childGrade,
    pickupTime,
    pickupDate,
    pickupLocation,
    dropoffLocation,
    emergencyPhone,
  });

  // 增加发单统计
  await incrementRequestCount(userId).catch(() => {});

  // 流式生成 AI 求助文案
  if (!AI_API_KEY) {
    const fallback = `各位家长好，我是${childName}的家长，${pickupDate}${pickupTime}因临时有事，无法到${childSchool}接孩子。孩子在${pickupLocation}等候，需要送到${dropoffLocation}。有顺路的好邻居能帮忙吗？万分感谢！`;
    return NextResponse.json({ id: record.id, aiText: fallback });
  }

  try {
    const aiRes = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        stream: true,
        messages: [
          {
            role: "system",
            content: "你是一个小区家长群助手，帮家长写简洁温暖的接送求助消息。要求：不超过80字，包含孩子、学校、时间、地点信息，语气像在和邻居说话，自然亲切。",
          },
          {
            role: "user",
            content: `帮我写一条求助消息：孩子${childName}在${childSchool}上${childGrade ?? "小学"}，${pickupDate}${pickupTime}需要在${pickupLocation}接孩子，送到${dropoffLocation}。我临时有事来不了，求顺路的邻居帮忙。`,
          },
        ],
      }),
    });

    if (!aiRes.ok) throw new Error(`AI API error: ${aiRes.status}`);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(`__ID__:${record.id}\n`));
        try {
          const reader = aiRes.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content ?? "";
                if (delta) controller.enqueue(encoder.encode(delta));
              } catch { /* skip malformed chunks */ }
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    const fallback = `各位家长好，我是${childName}的家长，${pickupDate}${pickupTime}因临时有事，无法到${childSchool}接孩子。孩子在${pickupLocation}等候，需要送到${dropoffLocation}。有顺路的好邻居能帮忙吗？万分感谢！`;
    return NextResponse.json({ id: record.id, aiText: fallback });
  }
}
