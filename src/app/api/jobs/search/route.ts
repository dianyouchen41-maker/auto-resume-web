import { NextResponse } from "next/server"
import { searchRealJobs } from "@/lib/job-scraper"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get("keyword") || ""
    const city = searchParams.get("city") || "北京"
    const platform = searchParams.get("platform") || "all"

    if (!keyword) {
      return NextResponse.json({ error: "请输入搜索关键词" }, { status: 400 })
    }

    console.log(`Searching jobs: keyword=${keyword}, city=${city}, platform=${platform}`)

    // 从各平台抓取真实岗位数据
    const jobs = await searchRealJobs(keyword, city, platform)

    console.log(`Found ${jobs.length} jobs`)

    return NextResponse.json({
      jobs,
      total: jobs.length,
      keyword,
      city,
      platform,
    })
  } catch (error) {
    console.error("Job search error:", error)
    return NextResponse.json(
      { error: "搜索失败，请稍后再试", jobs: [] },
      { status: 500 }
    )
  }
}
