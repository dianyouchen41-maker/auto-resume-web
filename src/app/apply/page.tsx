"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Send,
  ArrowLeft,
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const platforms = [
  { id: "boss", name: "BOSS直聘", icon: "👔", color: "bg-green-100 text-green-600" },
  { id: "zhilian", name: "智联招聘", icon: "🏢", color: "bg-blue-100 text-blue-600" },
  { id: "lagou", name: "拉勾网", icon: "🚀", color: "bg-violet-100 text-violet-600" },
  { id: "job51", name: "前程无忧", icon: "📋", color: "bg-orange-100 text-orange-600" },
]

const cities = [
  "北京", "上海", "广州", "深圳", "杭州", "成都",
  "南京", "武汉", "西安", "苏州", "长沙", "重庆",
]

export default function ApplyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [keywords, setKeywords] = useState("")
  const [selectedCities, setSelectedCities] = useState<string[]>(["北京", "上海"])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["boss", "zhilian"])
  const [salaryMin, setSalaryMin] = useState(15)
  const [salaryMax, setSalaryMax] = useState(30)
  const [maxApply, setMaxApply] = useState(20)
  const [isApplying, setIsApplying] = useState(false)
  const [results, setResults] = useState<any>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    )
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handleApply = async () => {
    if (!keywords.trim()) {
      toast({
        title: "请输入关键词",
        description: "请输入岗位搜索关键词",
        variant: "destructive",
      })
      return
    }

    if (selectedCities.length === 0) {
      toast({
        title: "请选择城市",
        description: "请至少选择一个意向城市",
        variant: "destructive",
      })
      return
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "请选择平台",
        description: "请至少选择一个投递平台",
        variant: "destructive",
      })
      return
    }

    setIsApplying(true)
    setResults(null)

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          keywords: keywords.split(",").map((k) => k.trim()),
          cities: selectedCities,
          salaryMin: salaryMin * 1000,
          salaryMax: salaryMax * 1000,
          maxApply,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "投递失败")
      }

      setResults(data.results)
      toast({
        title: "投递完成",
        description: `成功: ${data.results.success}, 失败: ${data.results.failed}`,
      })
    } catch (error) {
      toast({
        title: "投递失败",
        description: error instanceof Error ? error.message : "请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsApplying(false)
    }
  }

  if (status === "loading") {
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
              <Send className="w-5 h-5 text-white" />
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
          <h1 className="text-3xl font-bold mb-2">自动投递</h1>
          <p className="text-gray-600 dark:text-gray-400">
            设置条件后一键自动投递简历
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 w-5 h-5" />
                  搜索关键词
                </CardTitle>
                <CardDescription>输入岗位关键词，多个用逗号分隔</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="例: Python开发, 后端开发, 全栈开发"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Cities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 w-5 h-5" />
                  意向城市
                </CardTitle>
                <CardDescription>选择你想工作的城市</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <Button
                      key={city}
                      variant={selectedCities.includes(city) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCity(city)}
                    >
                      {city}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 w-5 h-5" />
                  投递平台
                </CardTitle>
                <CardDescription>选择要投递的招聘平台</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {platforms.map((platform) => (
                    <div
                      key={platform.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{platform.icon}</div>
                        <div>
                          <div className="font-medium">{platform.name}</div>
                        </div>
                        {selectedPlatforms.includes(platform.id) && (
                          <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Salary & Limit */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 w-5 h-5" />
                  薪资范围 & 投递限制
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>最低薪资 (K)</Label>
                    <Input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(parseInt(e.target.value))}
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>最高薪资 (K)</Label>
                    <Input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(parseInt(e.target.value))}
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>单次投递上限</Label>
                    <Input
                      type="number"
                      value={maxApply}
                      onChange={(e) => setMaxApply(parseInt(e.target.value))}
                      min={1}
                      max={100}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Start Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleApply}
              disabled={isApplying}
            >
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  投递中...
                </>
              ) : (
                <>
                  <Send className="mr-2 w-5 h-5" />
                  开始投递
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>投递结果</CardTitle>
                <CardDescription>实时显示投递进度</CardDescription>
              </CardHeader>
              <CardContent>
                {isApplying ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">正在投递中...</p>
                  </div>
                ) : results ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{results.success}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">成功</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">失败</div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">投递详情</h4>
                      <div className="space-y-3">
                        {results.applications.map((app: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div>
                              <div className="font-medium">{app.company}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {app.jobTitle}
                              </div>
                            </div>
                            {app.status === "applied" ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Clock className="w-12 h-12 mb-4" />
                    <p>设置条件后开始投递</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
