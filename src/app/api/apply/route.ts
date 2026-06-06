import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Demo applications data
const demoApplications = [
  {
    id: "demo-1",
    platform: "boss",
    jobTitle: "前端开发工程师",
    company: "字节跳动",
    salary: "25-40K",
    city: "北京",
    status: "applied",
    appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-2",
    platform: "zhilian",
    jobTitle: "全栈开发",
    company: "阿里巴巴",
    salary: "30-50K",
    city: "上海",
    status: "applied",
    appliedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-3",
    platform: "lagou",
    jobTitle: "后端开发",
    company: "腾讯",
    salary: "28-45K",
    city: "深圳",
    status: "failed",
    appliedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-4",
    platform: "job51",
    jobTitle: "Java开发",
    company: "美团",
    salary: "22-35K",
    city: "北京",
    status: "applied",
    appliedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
]

// 开始投递
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await req.json()
    const { platforms, keywords, cities, salaryMin, salaryMax, maxApply } = body

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({ error: "请设置搜索关键词" }, { status: 400 })
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: "请选择至少一个平台" }, { status: 400 })
    }

    // Demo results
    const results = {
      total: 10,
      success: 8,
      failed: 2,
      skipped: 0,
      applications: [
        {
          platform: platforms[0] || "boss",
          company: "字节跳动",
          jobTitle: `${keywords[0]}开发工程师`,
          salary: "25-40K",
          city: cities[0] || "北京",
          status: "applied",
        },
        {
          platform: platforms[1] || "zhilian",
          company: "阿里巴巴",
          jobTitle: `高级${keywords[0]}工程师`,
          salary: "30-50K",
          city: cities[1] || "上海",
          status: "applied",
        },
      ],
    }

    // Save to database if available
    if (prisma) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        })

        if (user) {
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
        }
      } catch (dbError) {
        console.warn("Database save failed, using demo mode:", dbError)
      }
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

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const platform = searchParams.get("platform") || undefined
    const status = searchParams.get("status") || undefined

    // Demo mode
    if (!prisma) {
      let filtered = [...demoApplications]
      if (platform && platform !== "all") {
        filtered = filtered.filter((a) => a.platform === platform)
      }
      if (status && status !== "all") {
        filtered = filtered.filter((a) => a.status === status)
      }
      return NextResponse.json({
        applications: filtered,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: 1,
        },
      })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({
        applications: demoApplications,
        pagination: { page, limit, total: demoApplications.length, totalPages: 1 },
      })
    }

    const where: any = { userId: user.id }
    if (platform && platform !== "all") where.platform = platform
    if (status && status !== "all") where.status = status

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
      applications: applications.length > 0 ? applications : demoApplications,
      pagination: {
        page,
        limit,
        total: total || demoApplications.length,
        totalPages: Math.ceil((total || demoApplications.length) / limit),
      },
    })
  } catch (error) {
    console.error("Get applications error:", error)
    return NextResponse.json({
      applications: demoApplications,
      pagination: { page: 1, limit: 20, total: demoApplications.length, totalPages: 1 },
    })
  }
}
