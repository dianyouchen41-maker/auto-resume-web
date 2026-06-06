import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// 搜索岗位
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get("keyword") || ""
    const city = searchParams.get("city") || "北京"
    const platform = searchParams.get("platform") || "all"
    const salaryMin = parseInt(searchParams.get("salaryMin") || "0")
    const salaryMax = parseInt(searchParams.get("salaryMax") || "999999")

    if (!keyword) {
      return NextResponse.json({ error: "请输入搜索关键词" }, { status: 400 })
    }

    // 这里应该调用实际的搜索API
    // 由于需要浏览器自动化，这里返回模拟数据
    const mockJobs = [
      {
        id: "1",
        title: `${keyword}开发工程师`,
        company: "字节跳动",
        salary: "25-40K",
        city: city,
        platform: "boss",
        url: "https://www.zhipin.com/job/1",
        experience: "3-5年",
        education: "本科",
      },
      {
        id: "2",
        title: `高级${keyword}工程师`,
        company: "阿里巴巴",
        salary: "30-50K",
        city: city,
        platform: "zhilian",
        url: "https://www.zhaopin.com/job/2",
        experience: "5-10年",
        education: "本科",
      },
      {
        id: "3",
        title: `${keyword}架构师`,
        company: "腾讯",
        salary: "40-60K",
        city: city,
        platform: "lagou",
        url: "https://www.lagou.com/job/3",
        experience: "5-10年",
        education: "硕士",
      },
      {
        id: "4",
        title: `${keyword}全栈开发`,
        company: "美团",
        salary: "20-35K",
        city: city,
        platform: "job51",
        url: "https://www.51job.com/job/4",
        experience: "1-3年",
        education: "本科",
      },
    ]

    // 根据平台筛选
    let filteredJobs = mockJobs
    if (platform !== "all") {
      filteredJobs = mockJobs.filter((job) => job.platform === platform)
    }

    return NextResponse.json({ jobs: filteredJobs })
  } catch (error) {
    console.error("Search jobs error:", error)
    return NextResponse.json({ error: "搜索岗位失败" }, { status: 500 })
  }
}
