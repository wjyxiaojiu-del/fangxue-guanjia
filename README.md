> **中文** | [English](README_en.md)

# 放学帮 · 后端 API

「放学帮」的 Next.js 后端服务，提供微信小程序所需的 REST API。

## 技术栈

- **框架**：Next.js 15 (App Router)
- **ORM**：Drizzle ORM
- **数据库**：PostgreSQL
- **认证**：微信登录 + JWT
- **AI**：DeepSeek V3（生成求助文案）

## 快速开始

### 1. 环境要求

- Node.js 20+
- PostgreSQL 14+（或使用 Docker）

### 2. 安装依赖

```bash
npm install
```

### 3. 启动数据库（Docker 方式）

```bash
docker compose up -d
```

### 4. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```env
# 数据库
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fangxue

# 微信小程序（去微信公众平台获取）
WECHAT_APPID=wx你的小程序appid
WECHAT_SECRET=你的小程序secret

# JWT 密钥（随机生成 64 位以上字符串）
JWT_SECRET=your_random_secret_here

# AI 文案生成（可选，未配置则使用 fallback 文案）
AI_BASE_URL=https://api.deepseek.com/v1
AI_API_KEY=your_ai_api_key
AI_MODEL=deepseek-chat
```

### 5. 数据库初始化

```bash
# 生成迁移文件
npm run db:generate

# 执行迁移
npm run db:migrate
```

### 6. 启动开发服务器

```bash
npm run dev
```

服务默认运行在 `http://localhost:3000`

## API 文档

### 认证

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/auth/wechat` | 微信登录，换取 JWT Token |

请求体：
```json
{
  "code": "微信 login 返回的 code",
  "nickName": "微信昵称（可选）",
  "avatarUrl": "头像地址（可选）"
}
```

响应：
```json
{
  "token": "jwt_token",
  "user": {
    "id": "用户ID",
    "openid": "微信openid"
  }
}
```

### 接送需求

| 方法 | 路径 | 认证 | 说明 |
|---|---|---|---|
| GET | `/api/requests` | ✅ | 获取需求广场列表 |
| POST | `/api/requests` | ✅ | 发布新需求（流式返回 AI 文案） |
| GET | `/api/requests/mine` | ✅ | 我发布的需求 |
| GET | `/api/requests/:id` | ✅ | 需求详情 |
| PATCH | `/api/requests/:id` | ✅ | 接单 / 完成 / 取消 |

### 家长资料

| 方法 | 路径 | 认证 | 说明 |
|---|---|---|---|
| GET | `/api/parent-profile` | ✅ | 获取当前用户资料 |
| POST | `/api/parent-profile` | ✅ | 创建或更新资料 |

### 用户

| 方法 | 路径 | 认证 | 说明 |
|---|---|---|---|
| GET | `/api/user/profile` | ✅ | 获取用户信息 |

## 数据库结构

```
pickup_requests      # 接送需求表
parent_profiles      # 家长资料表
users                # 用户表（微信登录）
```

详见 `src/lib/db/schema/`

## 部署

### Vercel（推荐）

```bash
npm i -g vercel
vercel --prod
```

### 自建服务器

```bash
npm run build
npm start
```

## 与前端对接

前端 uni-app 项目地址：`../fangxue-guanjia-uniapp/`

对接文档见 `../miniapp/API_INTEGRATION.md`

## 开源协议

[MIT License](./LICENSE)
