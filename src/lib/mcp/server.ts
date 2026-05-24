import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getPlazaRequests, getMyPublishedRequests, acceptRequest, completeRequest } from "../db/queries/pickup-requests";
import { getParentProfile } from "../db/queries/parent-profiles";

export function buildMcpServer(userId: string): McpServer {
  const server = new McpServer({
    name: "fangxue-guanjia",
    version: "2.0.0",
  });

  // 工具1：查看需求广场
  server.tool(
    "browse_plaza",
    "查看附近所有待接单的放学接送需求",
    {},
    async () => {
      const requests = await getPlazaRequests(userId);
      if (requests.length === 0) {
        return { content: [{ type: "text" as const, text: "目前需求广场暂无待接单需求。" }] };
      }
      const text = requests.map((r) =>
        `#${r.id} | ${r.publisherName} | ${r.childName}（${r.childSchool}）| ${r.pickupDate} ${r.pickupTime} | ${r.pickupLocation} → ${r.dropoffLocation}`
      ).join("\n");
      return { content: [{ type: "text" as const, text: `需求广场共 ${requests.length} 条待接单需求：\n${text}` }] };
    }
  );

  // 工具2：接单
  server.tool(
    "accept_request",
    "接单帮助发单家长接送孩子",
    { request_id: z.number().describe("需求 ID") },
    async ({ request_id }) => {
      const profile = await getParentProfile(userId);
      const acceptorName = profile?.displayName ?? "邻居家长";
      const updated = await acceptRequest(request_id, userId, acceptorName);
      if (!updated) return { content: [{ type: "text" as const, text: "接单失败，该需求可能已被他人接单。" }] };
      return { content: [{ type: "text" as const, text: `接单成功！你将在 ${updated.pickupDate} ${updated.pickupTime} 前往 ${updated.pickupLocation} 接 ${updated.childName}。` }] };
    }
  );

  // 工具3：查看我发布的需求
  server.tool(
    "my_published_requests",
    "查看我发布的所有接送需求及当前状态",
    {},
    async () => {
      const requests = await getMyPublishedRequests(userId);
      if (requests.length === 0) return { content: [{ type: "text" as const, text: "你还没有发布过接送需求。" }] };
      const text = requests.map((r) =>
        `#${r.id} | ${r.childName} | 状态：${r.status === "pending" ? "等待接单" : r.status === "accepted" ? `已有 ${r.acceptorName} 接单` : "已完成"} | ${r.pickupDate} ${r.pickupTime}`
      ).join("\n");
      return { content: [{ type: "text" as const, text: `你的发单记录：\n${text}` }] };
    }
  );

  // 工具4：打卡确认安全到家
  server.tool(
    "confirm_safe_arrival",
    "确认孩子已安全到家，完成接送打卡",
    { request_id: z.number().describe("需求 ID") },
    async ({ request_id }) => {
      const updated = await completeRequest(request_id, userId);
      if (!updated) return { content: [{ type: "text" as const, text: "打卡失败，请确认你是该需求的发单人。" }] };
      return { content: [{ type: "text" as const, text: `打卡成功！${updated.childName} 已安全到家。感谢 ${updated.acceptorName ?? "邻居"} 的帮助！` }] };
    }
  );

  // 工具5：查看个人资料
  server.tool(
    "get_my_profile",
    "查看我的家长资料，包括孩子信息和互助记录",
    {},
    async () => {
      const profile = await getParentProfile(userId);
      if (!profile) return { content: [{ type: "text" as const, text: "你还没有完成个人资料填写，请先去主页完善信息。" }] };
      return {
        content: [{
          type: "text" as const,
          text: `姓名：${profile.displayName}\n小区：${profile.community ?? "未填写"}\n孩子：${profile.childName ?? "未填写"}（${profile.childSchool ?? ""}${profile.childGrade ? " " + profile.childGrade : ""}）\n接单次数：${profile.helpCount}\n发单次数：${profile.requestCount}\n互助积分：${profile.trustScore * 10}`
        }]
      };
    }
  );

  return server;
}
