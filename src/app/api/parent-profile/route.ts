import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getParentProfile, upsertParentProfile } from "@/lib/db/queries/parent-profiles";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { id: userId } = auth.user;
  const profile = await getParentProfile(userId);
  return NextResponse.json(profile ?? null);
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { id: userId } = auth.user;
  const body = await request.json();
  const profile = await upsertParentProfile(userId, body);
  return NextResponse.json(profile);
}
