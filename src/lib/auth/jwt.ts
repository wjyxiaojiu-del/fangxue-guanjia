import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-change-in-production"
);

export interface JwtPayload {
  sub: string;   // user id (= WeChat openid)
  name?: string;
  avatar?: string;
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ name: payload.name, avatar: payload.avatar })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      sub: payload.sub!,
      name: payload.name as string | undefined,
      avatar: payload.avatar as string | undefined,
    };
  } catch {
    return null;
  }
}
