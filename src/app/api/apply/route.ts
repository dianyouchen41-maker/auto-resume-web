import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 开始投递
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    const body = await req.json()
    const { platforms, keywords, cities, salaryMin, salaryMax, maxApply } = body

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({ error: "请设置搜索关键词" }, { status: 400 })
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: "请选择至少一个平台" }, { status: 400 })
    }

    // 这里应该启动实际的自动投递任务
    // 由于需要浏览器自动化，这里返回模拟结果
    const results = {
      total: 10,
      success: 8,
      failed: 2,
      skipped: 0,
      applications: [
        {
          platform: "boss",
          company: "字节跳动",
          jobTitle: "前端开发工程师",
          salary: "25-40K",
          city: "北京",
          status: "applied",
        },
        {
          platform: "zhilian",
          company: "阿里巴巴",
          jobTitle: "全栈开发",
          salary: "30-50K",
          city: "上海",
          status: "applied",
        },
      ],
    }

    // 保存投递记录
    for (const app of results.applications) {
      await prisma.application.create({
        data: {
          userId: user.id,
          platform: app.platform,
          jobTitle: app.jobTitle,
          company: app.company,
          salary: app.salary,
          city: app.city,
          status: app.status,
        },
      })
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Apply error:", error)
    return NextResponse.json({ error: "投递失败" }, { status: 500 })
  }
}

// 获取投递记录
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const platform = searchParams.get("platform") || undefined
    const status = searchParams.get("status") || undefined

    const where: any = { userId: user.id }
    if (platform) where.platform = platform
    if (status) where.status = status

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { appliedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.application.count({ where }),
    ])

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get applications error:", error)
    return NextResponse.json({ error: "获取投递记录失败" }, { status: 500 })
  }
}
