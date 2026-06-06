"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Search,
  Send,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Globe,
  Clock,
  Users
} from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "智能简历解析",
    description: "上传简历自动提取技能关键词，智能匹配岗位",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    icon: Search,
    title: "多平台搜索",
    description: "同时搜索 BOSS直聘、智联、拉勾、51job 等平台",
    color: "text-violet-600",
    bgColor: "bg-violet-100 dark:bg-violet-900/20",
  },
  {
    icon: Send,
    title: "一键自动投递",
    description: "设置条件后自动投递，支持批量操作",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    icon: BarChart3,
    title: "数据统计分析",
    description: "投递记录、成功率、趋势图一目了然",
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
  },
  {
    icon: Shield,
    title: "安全可靠",
    description: "本地存储 cookies，隐私数据不上传",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20",
  },
  {
    icon: Zap,
    title: "高效便捷",
    description: "告别重复操作，节省 80% 求职时间",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
  },
]

const platforms = [
  { name: "BOSS直聘", logo: "👔", jobs: "100万+" },
  { name: "智联招聘", logo: "🏢", jobs: "80万+" },
  { name: "拉勾网", logo: "🚀", jobs: "50万+" },
  { name: "前程无忧", logo: "📋", jobs: "120万+" },
]

const stats = [
  { label: "用户数", value: "10,000+", icon: Users },
  { label: "投递成功率", value: "85%", icon: CheckCircle2 },
  { label: "支持平台", value: "4+", icon: Globe },
  { label: "节省时间", value: "80%", icon: Clock },
]

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AutoResume</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              功能
            </Link>
            <Link href="#platforms" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              支持平台
            </Link>
            <Link href="#pricing" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              价格
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">登录</Button>
            </Link>
            <Link href="/register">
              <Button>免费注册</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm mb-6 animate-fade-in">
            <Zap className="w-4 h-4 mr-2" />
            让求职更高效
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">智能简历投递</span>
            <br />
            <span className="text-gray-900 dark:text-white">一站式平台</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in">
            上传简历，选择平台，一键投递。支持 BOSS直聘、智联招聘、拉勾网、前程无忧等主流招聘平台。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                免费开始使用
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                了解更多
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">强大功能</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              一站式解决你的求职需求
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">支持主流招聘平台</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              一次设置，多平台同时投递
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((platform, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="text-5xl mb-4">{platform.logo}</div>
                  <CardTitle>{platform.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{platform.jobs}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">在招岗位</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-violet-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            准备好开始了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            立即注册，开启高效求职之旅
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
              免费注册
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">AutoResume</span>
              </div>
              <p className="text-sm">
                智能简历投递平台，让求职更高效
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">产品</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white transition-colors">功能</Link></li>
                <li><Link href="#platforms" className="hover:text-white transition-colors">支持平台</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">价格</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">支持</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">帮助中心</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">联系我们</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">反馈建议</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">法律</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">服务条款</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">隐私政策</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2024 AutoResume. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
