# 贡献指南

## 后端开发规范

### 技术栈

- Next.js 15+ (App Router)
- Drizzle ORM
- PostgreSQL
- TypeScript

### 数据库迁移

```bash
# 修改 schema 后生成迁移
npm run db:generate

# 执行迁移
npm run db:migrate

# 本地调试数据库
npm run db:studio
```

### API 设计规范

- 统一返回 JSON 格式
- 错误状态码：400（参数错误）、401（未登录）、404（未找到）、409（冲突）
- 认证使用 Bearer Token（JWT）

### 提交规范

见前端项目的 [CONTRIBUTING.md](../fangxue-guanjia-uniapp/CONTRIBUTING.md)
