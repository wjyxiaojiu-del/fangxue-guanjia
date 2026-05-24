import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getMyPublishedRequests, getMyAcceptedRequests } from "@/lib/db/queries/pickup-requests";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { id: userId } = auth.user;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "published" | "accepted"

  if (type === "accepted") {
    const data = await getMyAcceptedRequests(userId);
    return NextResponse.json(data);
  }

  const data = await getMyPublishedRequests(userId);
  return NextResponse.json(data);
}
