import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { upsertUser } from "@/lib/db/queries";
import { upsertParentProfile } from "@/lib/db/queries/parent-profiles";

/**
 * POST /api/auth/wechat
 * 微信小程序登录：用 wx.login() 获取的 code 换取 JWT token
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, nickName, avatarUrl } = body;

  if (!code) {
    return NextResponse.json({ error: "缺少 code 参数" }, { status: 400 });
  }

  const appId = process.env.WECHAT_APPID;
  const secret = process.env.WECHAT_SECRET;

  if (!appId || !secret) {
    return NextResponse.json(
      { error: "服务端未配置微信小程序凭据" },
      { status: 500 }
    );
  }

  // 用 code 换取 openid + session_key
  const wxUrl =
    `https://api.weixin.qq.com/sns/jscode2session` +
    `?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

  try {
    const wxRes = await fetch(wxUrl);
    const wxData = await wxRes.json();

    if (wxData.errcode) {
      console.error("[wechat-login] WeChat API error:", wxData);
      return NextResponse.json(
        { error: "微信登录失败", detail: wxData.errmsg },
        { status: 401 }
      );
    }

    const { openid } = wxData as { openid: string; session_key: string };

    // 创建/更新用户记录
    await upsertUser({
      id: openid,
      name: nickName ?? null,
      avatarUrl: avatarUrl ?? null,
    }).catch((err) => console.error("[wechat-login] upsertUser failed", err));

    // 确保有家长资料
    await upsertParentProfile(openid, {
      displayName: nickName ?? "家长",
    }).catch((err) =>
      console.error("[wechat-login] upsertParentProfile failed", err)
    );

    // 签发 JWT
    const token = await signToken({
      sub: openid,
      name: nickName,
      avatar: avatarUrl,
    });

    return NextResponse.json({
      token,
      user: {
        id: openid,
        nickname: nickName ?? null,
        avatarUrl: avatarUrl ?? null,
      },
    });
  } catch (err) {
    console.error("[wechat-login] unexpected error:", err);
    return NextResponse.json(
      { error: "登录服务暂时不可用" },
      { status: 500 }
    );
  }
}
