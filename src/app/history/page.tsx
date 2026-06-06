"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  ArrowLeft,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase
} from "lucide-react"

interface Application {
  id: string
  platform: string
  jobTitle: string
  company: string
  salary: string | null
  city: string | null
  status: string
  appliedAt: string
}

const platformNames: Record<string, string> = {
  boss: "BOSS直聘",
  zhilian: "智联招聘",
  lagou: "拉勾网",
  job51: "前程无忧",
}

const statusColors: Record<string, string> = {
  applied: "text-green-600 bg-green-100",
  failed: "text-red-600 bg-red-100",
  pending: "text-orange-600 bg-orange-100",
  skipped: "text-gray-600 bg-gray-100",
}

const statusLabels: Record<string, string> = {
  applied: "已投递",
  failed: "失败",
  pending: "待处理",
  skipped: "已跳过",
}

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterPlatform, setFilterPlatform] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
    if (status === "authenticated") {
      fetchApplications()
    }
  }, [status, router])

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams()
      if (filterPlatform !== "all") params.append("platform", filterPlatform)
      if (filterStatus !== "all") params.append("status", filterStatus)

      const response = await fetch(`/api/apply?${params.toString()}`)
      const data = await response.json()
      if (data.applications) {
        setApplications(data.applications)
      }
    } catch (error) {
      console.error("Fetch applications error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchApplications()
    }
  }, [filterPlatform, filterStatus])

  const stats = {
    total: applications.length,
    success: applications.filter((a) => a.status === "applied").length,
    failed: applications.filter((a) => a.status === "failed").length,
    successRate: applications.length > 0
      ? Math.round((applications.filter((a) => a.status === "applied").length / applications.length) * 100)
      : 0,
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AutoResume</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 w-4 h-4" />
              返回仪表盘
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">投递记录</h1>
          <p className="text-gray-600 dark:text-gray-400">
            查看投递历史和统计数据
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">总投递</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.success}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">成功</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">失败</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.successRate}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">成功率</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">筛选：</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterPlatform === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterPlatform("all")}
                >
                  全部平台
                </Button>
                {Object.entries(platformNames).map(([key, name]) => (
                  <Button
                    key={key}
                    variant={filterPlatform === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterPlatform(key)}
                  >
                    {name}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  全部状态
                </Button>
                <Button
                  variant={filterStatus === "applied" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("applied")}
                >
                  成功
                </Button>
                <Button
                  variant={filterStatus === "failed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("failed")}
                >
                  失败
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>投递列表</CardTitle>
                <CardDescription>共 {applications.length} 条记录</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 w-4 h-4" />
                导出
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Briefcase className="w-16 h-16 mx-auto mb-4" />
                <p>暂无投递记录</p>
                <Link href="/apply">
                  <Button className="mt-4">开始投递</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-4 px-4 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium">{app.company}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {app.jobTitle}
                          {app.salary && ` · ${app.salary}`}
                          {app.city && ` · ${app.city}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {platformNames[app.platform] || app.platform}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(app.appliedAt).toLocaleString()}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[app.status] || "text-gray-600 bg-gray-100"
                        }`}
                      >
                        {statusLabels[app.status] || app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
