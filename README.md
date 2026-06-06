# 🚀 AutoResume - 智能简历投递平台

一站式自动投递简历网站，支持多平台、智能筛选、自动投递。

## ✨ 功能特性

- 📄 **简历管理** - 上传简历，自动解析技能关键词
- 🔍 **岗位搜索** - 多平台搜索，智能筛选
- 🚀 **自动投递** - 一键投递，支持批量操作
- 📊 **数据统计** - 投递记录、成功率、趋势分析
- 🔐 **用户系统** - 注册登录，个人数据隔离
- 📱 **响应式设计** - 支持 PC 和移动端

## 🛠️ 技术栈

- **前端**: Next.js 14 + React + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: SQLite (Prisma ORM)
- **认证**: NextAuth.js
- **UI 组件**: shadcn/ui

## 📦 安装

```bash
# 安装依赖
npm install

# 初始化数据库
npx prisma db push

# 启动开发服务器
npm run dev
```

## 🚀 快速开始

1. 访问 http://localhost:3000
2. 注册账号
3. 上传简历
4. 搜索岗位
5. 开始投递

## 📁 项目结构

```
auto-resume-web/
├── prisma/
│   └── schema.prisma          # 数据库模型
├── src/
│   ├── app/
│   │   ├── page.tsx           # 首页
│   │   ├── dashboard/         # 仪表盘
│   │   ├── resume/            # 简历管理
│   │   ├── jobs/              # 岗位搜索
│   │   ├── apply/             # 自动投递
│   │   ├── history/           # 投递记录
│   │   ├── settings/          # 设置
│   │   └── api/               # API 路由
│   ├── components/
│   │   ├── ui/                # UI 组件
│   │   └── providers/         # Context Providers
│   └── lib/
│       ├── prisma.ts          # Prisma 客户端
│       ├── auth.ts            # NextAuth 配置
│       └── utils.ts           # 工具函数
├── public/
├── package.json
└── README.md
```

## 🔧 环境变量

创建 `.env` 文件：

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GITHUB_ID=""
GITHUB_SECRET=""
```

## 📖 API 文档

### 认证

- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/session` - 获取会话

### 简历

- `GET /api/resume` - 获取简历列表
- `POST /api/resume` - 上传简历

### 岗位

- `GET /api/jobs/search` - 搜索岗位

### 投递

- `POST /api/apply` - 开始投递
- `GET /api/apply` - 获取投递记录

## 🎨 页面预览

- **首页** - 产品介绍、功能展示
- **仪表盘** - 统计概览、快捷操作
- **简历管理** - 上传、预览、管理简历
- **岗位搜索** - 多条件搜索、筛选
- **自动投递** - 设置条件、一键投递
- **投递记录** - 历史记录、数据统计

## 📄 License

MIT
