/**
 * 自动注入 Authorization header 的 fetch 封装
 */
export async function request(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  // 尝试从 localStorage 获取 token（Web 端）
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("fx_token");
  }

  return fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
