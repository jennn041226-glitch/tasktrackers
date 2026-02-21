# 部署到 Vercel 指南

## 准备工作

### 1. 注册 Vercel 账号
访问 https://vercel.com 用 GitHub/GitLab/邮箱注册

### 2. 安装 Vercel CLI（可选）
```bash
npm i -g vercel
```

## 部署步骤

### 方法一：通过 GitHub 部署（推荐）

1. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 仓库名称：`tasktracker`
   - 设为 Private（私有）

2. **推送代码到 GitHub**
   ```bash
   cd task-tracker/my-app
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/tasktracker.git
   git push -u origin main
   ```

3. **在 Vercel 导入项目**
   - 访问 https://vercel.com/new
   - 选择 GitHub 仓库 `tasktracker`
   - 点击 Import

4. **配置环境变量**
   在 Vercel 项目设置中，添加环境变量：
   - `DATABASE_URL`：你的 PostgreSQL 数据库连接字符串

5. **部署**
   - 点击 Deploy
   - 等待构建完成

### 方法二：使用 Vercel Postgres（最简单的数据库方案）

1. 在 Vercel Dashboard 中，点击你的项目
2. 进入 **Storage** 标签
3. 点击 **Create Database**
4. 选择 **Postgres** → **Create**
5. 选择 **Connect to Project** 连接到你的项目
6. 环境变量会自动配置

### 方法三：使用 Vercel CLI 部署

```bash
cd task-tracker/my-app
vercel login
vercel --prod
```

## 获取 PostgreSQL 数据库

### 免费选项：

1. **Vercel Postgres**（推荐）
   - Vercel 内置，与项目无缝集成
   - 免费额度：每月 256MB 存储

2. **Neon**（推荐）
   - 注册：https://neon.tech
   - 免费额度：3 个项目，每个 500MB
   - 创建数据库后复制连接字符串

3. **Supabase**
   - 注册：https://supabase.com
   - 免费额度：2 个项目，每个 500MB

## 配置说明

### 本地开发（SQLite）
`.env`:
```
DATABASE_URL="file:./dev.db"
```

### 生产环境（PostgreSQL）
Vercel 环境变量：
```
DATABASE_URL="postgresql://用户名:密码@主机:端口/数据库名?sslmode=require"
```

## 部署后操作

首次部署后，需要运行数据库迁移：

```bash
# 如果你有 Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

或者在 Vercel Dashboard 的 **Console** 中运行：
```bash
npx prisma migrate deploy
```

## 验证部署

1. 访问 Vercel 提供的域名（如 `https://tasktracker-xxx.vercel.app`）
2. 测试创建任务
3. 用手机浏览器访问同一链接，确认数据同步

## 常见问题

### 1. 数据库连接失败
- 检查 `DATABASE_URL` 是否正确设置
- 确认数据库允许外部连接

### 2. 迁移失败
- 在 Vercel Console 中手动运行：`npx prisma migrate deploy`

### 3. 构建失败
- 检查 `package.json` 中的 `build` 脚本
- 确认 `prisma generate` 在 `next build` 之前运行

## 自定义域名（可选）

1. 在 Vercel Dashboard → **Domains**
2. 添加你的域名
3. 按提示配置 DNS

## 费用说明

| 服务 | 免费额度 | 超出后 |
|------|---------|--------|
| Vercel 部署 | 每月 100GB 流量 | $0.12/GB |
| Vercel Postgres | 256MB 存储 | $0.15/GB/月 |
| Neon | 500MB/项目 | 按需付费 |

对于个人使用，免费额度完全够用。
