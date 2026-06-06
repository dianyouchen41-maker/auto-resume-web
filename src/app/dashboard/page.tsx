"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Search,
  Send,
  BarChart3,
  Settings,
  LogOut,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase
} from "lucide-react"

const quickActions = [
  {
    icon: FileText,
    title: "上传简历",
    description: "上传并解析你的简历",
    href: "/resume",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    icon: Search,
    title: "搜索岗位",
    description: "搜索符合条件的岗位",
    href: "/jobs",
    color: "text-violet-600",
    bgColor: "bg-violet-100 dark:bg-violet-900/20",
  },
  {
    icon: Send,
    title: "开始投递",
    description: "一键自动投递简历",
    href: "/apply",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    icon: BarChart3,
    title: "投递记录",
    description: "查看投递历史和统计",
    href: "/history",
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
  },
]

const recentApplications = [
  {
    id: 1,
    platform: "BOSS直聘",
    company: "字节跳动",
    position: "前端开发工程师",
    salary: "25-40K",
    status: "applied",
    time: "2小时前",
  },
  {
    id: 2,
    platform: "智联招聘",
    company: "阿里巴巴",
    position: "全栈开发",
    salary: "30-50K",
    status: "applied",
    time: "3小时前",
  },
  {
    id: 3,
    platform: "拉勾网",
    company: "腾讯",
    position: "后端开发",
    salary: "28-45K",
    status: "failed",
    time: "4小时前",
  },
  {
    id: 4,
    platform: "前程无忧",
    company: "美团",
    position: "Java开发",
    salary: "22-35K",
    status: "applied",
    time: "5小时前",
  },
]

const stats = [
  { label: "今日投递", value: "12", change: "+3", icon: Send, color: "text-blue-600" },
  { label: "成功率", value: "85%", change: "+5%", icon: TrendingUp, color: "text-green-600" },
  { label: "待处理", value: "3", change: "", icon: Clock, color: "text-orange-600" },
  { label: "总投递", value: "156", change: "+12", icon: Briefcase, color: "text-violet-600" },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AutoResume</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium">{session.user?.name || "用户"}</div>
              <div className="text-xs text-gray-500">{session.user?.email}</div>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            欢迎回来，{session.user?.name || "用户"} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            今天是美好的一天，让我们开始投递吧！
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    {stat.change && (
                      <div className="text-xs text-green-600">{stat.change}</div>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">快捷操作</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-4`}>
                      <action.icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">最近投递</h2>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                查看全部
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium">{app.company}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {app.position} · {app.salary}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{app.platform}</div>
                        <div className="text-xs text-gray-400">{app.time}</div>
                      </div>
                      {app.status === "applied" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
