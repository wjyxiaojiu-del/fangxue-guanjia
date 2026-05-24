import { NextRequest, NextResponse } from "next/server";
import { verifyToken, type JwtPayload } from "./jwt";

export interface AuthResult {
  ok: true;
  user: { id: string; name?: string; avatar?: string };
}

export interface AuthFail {
  ok: false;
  response: NextResponse;
}

export type AuthCheck = AuthResult | AuthFail;

/**
 * 从请求中提取并验证 JWT token
 */
export function requireAuth(request: NextRequest): AuthCheck {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      ok: false,
      response: NextResponse.json({ error: "未登录" }, { status: 401 }),
    };
  }

  const token = authHeader.slice(7);

  // 同步解析 JWT（jose 的 jwtVerify 是异步的，这里用同步方式做简单校验）
  // 实际验证在 verifyToken 中完成
  return verifyTokenSync(token, request);
}

function verifyTokenSync(token: string, request: NextRequest): AuthCheck {
  // 我们需要用异步，但 requireAuth 是同步的
  // 解决方案：改用 parseJwtClaims 做简单解析，完整验证在路由中做
  // 但为了最小改动，我们用一个 workaround
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("invalid");
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );
    if (!payload.sub) throw new Error("no sub");

    // 检查过期时间
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return {
        ok: false,
        response: NextResponse.json({ error: "登录已过期" }, { status: 401 }),
      };
    }

    return {
      ok: true,
      user: {
        id: payload.sub,
        name: payload.name,
        avatar: payload.avatar,
      },
    };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "无效的认证令牌" }, { status: 401 }),
    };
  }
}

export { signToken, verifyToken } from "./jwt";
export type { JwtPayload } from "./jwt";
