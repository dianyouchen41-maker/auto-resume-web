"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, ArrowLeft, Download, Filter, CheckCircle2, XCircle, Briefcase, Send } from "lucide-react"

const demoApps = [
  { id: 1, platform: "BOSS直聘", company: "字节跳动", jobTitle: "前端开发工程师", salary: "25-40K", city: "北京", status: "applied", appliedAt: "2小时前" },
  { id: 2, platform: "智联招聘", company: "阿里巴巴", jobTitle: "全栈开发", salary: "30-50K", city: "上海", status: "applied", appliedAt: "3小时前" },
  { id: 3, platform: "拉勾网", company: "腾讯", jobTitle: "后端开发", salary: "28-45K", city: "深圳", status: "failed", appliedAt: "4小时前" },
  { id: 4, platform: "前程无忧", company: "美团", jobTitle: "Java开发", salary: "22-35K", city: "北京", status: "applied", appliedAt: "5小时前" },
  { id: 5, platform: "猎聘", company: "华为", jobTitle: "高级架构师", salary: "40-60K", city: "深圳", status: "applied", appliedAt: "6小时前" },
  { id: 6, platform: "脉脉", company: "小米", jobTitle: "产品经理", salary: "25-45K", city: "北京", status: "applied", appliedAt: "7小时前" },
  { id: 7, platform: "九金十银", company: "京东", jobTitle: "Java开发", salary: "20-35K", city: "北京", status: "failed", appliedAt: "8小时前" },
  { id: 8, platform: "58同城", company: "顺丰", jobTitle: "物流系统开发", salary: "18-30K", city: "深圳", status: "applied", appliedAt: "9小时前" },
]

export default function HistoryPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [filterPlatform, setFilterPlatform] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) { setUser(JSON.parse(stored)) } else { router.push("/login") }
  }, [router])

  const filtered = demoApps.filter(a => {
    if (filterPlatform !== "all" && a.platform !== filterPlatform) return false
    if (filterStatus !== "all" && a.status !== filterStatus) return false
    return true
  })

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center"><Send className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">AutoResume</span>
          </Link>
          <Link href="/dashboard"><Button variant="ghost" size="sm"><ArrowLeft className="mr-2 w-4 h-4" />返回</Button></Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">投递记录</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{ l: "总投递", v: "156" }, { l: "成功", v: "132", c: "text-green-600" }, { l: "失败", v: "24", c: "text-red-600" }, { l: "成功率", v: "85%", c: "text-blue-600" }].map((s, i) => (
            <Card key={i}><CardContent className="p-4 text-center"><div className={`text-2xl font-bold ${s.c || ""}`}>{s.v}</div><div className="text-sm text-gray-600">{s.l}</div></CardContent></Card>
          ))}
        </div>
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Filter className="w-4 h-4 text-gray-500 mt-1" />
              {["all", "BOSS直聘", "智联招聘", "拉勾网", "前程无忧", "猎聘", "脉脉", "九金十银", "58同城"].map(p => (
                <Button key={p} variant={filterPlatform === p ? "default" : "outline"} size="sm" onClick={() => setFilterPlatform(p)}>
                  {p === "all" ? "全部平台" : p}
                </Button>
              ))}
              <span className="mx-2">|</span>
              {["all", "applied", "failed"].map(s => (
                <Button key={s} variant={filterStatus === s ? "default" : "outline"} size="sm" onClick={() => setFilterStatus(s)}>
                  {s === "all" ? "全部状态" : s === "applied" ? "成功" : "失败"}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div><CardTitle>投递列表</CardTitle><CardDescription>共 {filtered.length} 条</CardDescription></div>
              <Button variant="outline" size="sm"><Download className="mr-2 w-4 h-4" />导出</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {filtered.map(app => (
                <div key={app.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"><Briefcase className="w-5 h-5 text-gray-600" /></div>
                    <div>
                      <div className="font-medium">{app.company}</div>
                      <div className="text-sm text-gray-600">{app.jobTitle} · {app.salary} · {app.city}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{app.platform}</div>
                      <div className="text-xs text-gray-400">{app.appliedAt}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.status === "applied" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}>
                      {app.status === "applied" ? "成功" : "失败"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
