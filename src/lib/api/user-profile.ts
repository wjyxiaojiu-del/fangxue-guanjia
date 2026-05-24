import { request } from "./request";

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  try {
    const res = await request("/api/user/profile");
    if (!res.ok) return null;
    const json = (await res.json()) as { ok: boolean; user: UserProfile };
    return json.ok ? json.user : null;
  } catch {
    return null;
  }
}
