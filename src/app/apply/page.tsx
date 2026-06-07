"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, ArrowLeft, Search, MapPin, DollarSign, Briefcase, CheckCircle2, XCircle, Loader2, Plus, Globe } from "lucide-react"

// 全国城市列表
const allCities = [
  // 直辖市
  "北京", "上海", "天津", "重庆",
  // 省会及主要城市
  "广州", "深圳", "杭州", "成都", "南京", "武汉", "西安", "苏州", "长沙", "郑州",
  "合肥", "青岛", "大连", "厦门", "宁波", "福州", "济南", "昆明", "贵阳", "南昌",
  "太原", "石家庄", "哈尔滨", "长春", "沈阳", "南宁", "海口", "兰州", "银川",
  "西宁", "拉萨", "乌鲁木齐", "呼和浩特",
  // 经济发达城市
  "无锡", "常州", "佛山", "东莞", "珠海", "中山", "惠州", "温州", "嘉兴", "绍兴",
  "泉州", "烟台", "潍坊", "淄博", "徐州", "南通", "扬州", "镇江", "泰州", "盐城",
  "连云港", "芜湖", "马鞍山", "九江", "赣州", "洛阳", "宜昌", "襄阳", "岳阳", "常德",
  "绵阳", "德阳", "遵义", "曲靖", "咸阳", "宝鸡", "榆林", "唐山", "秦皇岛", "邯郸",
  "保定", "张家口", "承德", "廊坊", "衡水", "邢台",
]

// 全部招聘平台
const allPlatforms = [
  // 综合类
  { id: "boss", name: "BOSS直聘", icon: "👔", category: "综合" },
  { id: "zhilian", name: "智联招聘", icon: "🏢", category: "综合" },
  { id: "job51", name: "前程无忧", icon: "📋", category: "综合" },
  { id: "liepin", name: "猎聘", icon: "🎯", category: "综合" },
  { id: "kanzhun", name: "看准网", icon: "👀", category: "综合" },
  { id: "jiujinshiyin", name: "九金十银", icon: "💰", category: "综合" },
  { id: "58", name: "58同城", icon: "🏠", category: "综合" },
  { id: "ganji", name: "赶集直招", icon: "🏗️", category: "综合" },
  // 互联网类
  { id: "lagou", name: "拉勾网", icon: "🚀", category: "互联网" },
  { id: "maimai", name: "脉脉", icon: "💬", category: "互联网" },
  { id: "dajie", name: "大街网", icon: "🛣️", category: "互联网" },
  { id: "csdn", name: "CSDN招聘", icon: "💻", category: "互联网" },
  // 校园/实习类
  { id: "yingjiesheng", name: "应届生求职网", icon: "🎓", category: "校园" },
  { id: "shixisheng", name: "实习僧", icon: "📚", category: "校园" },
  { id: "ciwei", name: "刺猬实习", icon: "🦔", category: "校园" },
  { id: "niuke", name: "牛客网", icon: "🐂", category: "校园" },
  // 兼职类
  { id: "jianzhi", name: "兼职猫", icon: "🐱", category: "兼职" },
  { id: "doumi", name: "斗米兼职", icon: "🌾", category: "兼职" },
  // 海外类
  { id: "linkedin", name: "领英", icon: "💼", category: "海外" },
  { id: "indeed", name: "Indeed", icon: "🔍", category: "海外" },
  // 行业垂直类
  { id: "dxy", name: "丁香人才", icon: "🏥", category: "医疗" },
  { id: "teacher", name: "万行教师", icon: "👨‍🏫", category: "教育" },
  { id: "zhuopin", name: "智联卓聘", icon: "💎", category: "高端" },
]

interface Job {
  id: string
  title: string
  company: string
  salary: string
  city: string
  platform: string
  url: string
  experience: string
  education: string
}

export default function ApplyPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [keywords, setKeywords] = useState("")
  const [selectedCities, setSelectedCities] = useState<string[]>(["北京", "上海", "广州", "深圳"])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["boss", "zhilian", "job51", "lagou", "liepin"])
  const [salaryMin, setSalaryMin] = useState(15)
  const [salaryMax, setSalaryMax] = useState(50)
  const [maxApply, setMaxApply] = useState(50)
  const [isSearching, setIsSearching] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [results, setResults] = useState<any>(null)
  const [showAllCities, setShowAllCities] = useState(false)
  const [showAllPlatforms, setShowAllPlatforms] = useState(false)
  const [citySearch, setCitySearch] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      router.push("/login")
    }
  }, [router])

  const toggleCity = (c: string) => setSelectedCities((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  const togglePlatform = (p: string) => setSelectedPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))

  const selectAllPlatforms = () => setSelectedPlatforms(allPlatforms.map(p => p.id))
  const clearAllPlatforms = () => setSelectedPlatforms([])

  const filteredCities = citySearch
    ? allCities.filter(c => c.includes(citySearch))
    : showAllCities ? allCities : allCities.slice(0, 20)

  // 搜索真实岗位
  const handleSearch = async () => {
    if (!keywords.trim()) return

    setIsSearching(true)
    setJobs([])
    setResults(null)

    try {
      const allJobs: Job[] = []

      // 搜索每个选中的城市
      for (const city of selectedCities.slice(0, 3)) { // 限制前3个城市
        const params = new URLSearchParams({
          keyword: keywords.trim(),
          city: city,
          platform: "all",
        })

        try {
          const response = await fetch(`/api/jobs/search?${params.toString()}`)
          const data = await response.json()

          if (data.jobs) {
            allJobs.push(...data.jobs)
          }
        } catch (err) {
          console.error(`搜索 ${city} 失败:`, err)
        }
      }

      // 去重
      const uniqueJobs = allJobs.filter((job, index, self) =>
        index === self.findIndex(j => j.title === job.title && j.company === job.company)
      )

      setJobs(uniqueJobs)

      if (uniqueJobs.length === 0) {
        toast("未找到相关岗位，请尝试其他关键词")
      }
    } catch (err) {
      console.error("搜索失败:", err)
      toast("搜索失败，请稍后再试")
    } finally {
      setIsSearching(false)
    }
  }

  // 自动投递
  const handleApply = async () => {
    if (jobs.length === 0) {
      toast("请先搜索岗位")
      return
    }

    setIsApplying(true)
    setResults(null)

    // 模拟投递过程
    let success = 0
    let failed = 0
    const appliedJobs = []

    for (const job of jobs.slice(0, maxApply)) {
      // 模拟投递延迟
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

      // 模拟投递结果（80%成功率）
      const isSuccess = Math.random() > 0.2
      if (isSuccess) {
        success++
        appliedJobs.push({ ...job, status: "applied" })
      } else {
        failed++
        appliedJobs.push({ ...job, status: "failed" })
      }

      // 更新进度
      setResults({
        success,
        failed,
        total: Math.min(jobs.length, maxApply),
        applications: appliedJobs,
      })
    }

    setIsApplying(false)
    toast(`投递完成！成功: ${success}, 失败: ${failed}`)
  }

  const toast = (message: string) => {
    // 简单的提示
    alert(message)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">AutoResume</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 w-4 h-4" />
              返回
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">自动投递</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧：设置区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 搜索关键词 */}
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
                  className="text-base"
                />
              </CardContent>
            </Card>

            {/* 意向城市 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 w-5 h-5" />
                    意向城市
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">已选 {selectedCities.length} 个</span>
                    <Button variant="outline" size="sm" onClick={() => setShowAllCities(!showAllCities)}>
                      {showAllCities ? "收起" : "展开全部"}
                    </Button>
                  </div>
                </div>
                <CardDescription>选择你想工作的城市</CardDescription>
              </CardHeader>
              <CardContent>
                {/* 城市搜索 */}
                <div className="mb-4">
                  <Input
                    placeholder="搜索城市..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="max-w-xs"
                  />
                </div>

                {/* 城市列表 */}
                <div className="flex flex-wrap gap-2">
                  {filteredCities.map((city) => (
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

                {/* 快捷操作 */}
                <div className="mt-4 flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCities(allCities.slice(0, 10))}>
                    一线城市
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCities(allCities.slice(0, 30))}>
                    主要城市
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCities([])}>
                    清空
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 投递平台 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 w-5 h-5" />
                    投递平台
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">已选 {selectedPlatforms.length} 个</span>
                    <Button variant="outline" size="sm" onClick={selectAllPlatforms}>
                      全选
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearAllPlatforms}>
                      清空
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowAllPlatforms(!showAllPlatforms)}>
                      {showAllPlatforms ? "收起" : "展开全部"}
                    </Button>
                  </div>
                </div>
                <CardDescription>选择要投递的招聘平台</CardDescription>
              </CardHeader>
              <CardContent>
                {/* 按分类显示平台 */}
                {["综合", "互联网", "校园", "兼职", "海外", "医疗", "教育", "高端"].map(category => {
                  const categoryPlatforms = allPlatforms.filter(p => p.category === category)
                  if (categoryPlatforms.length === 0) return null

                  return (
                    <div key={category} className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">{category}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {categoryPlatforms.map((platform) => (
                          <div
                            key={platform.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedPlatforms.includes(platform.id)
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => togglePlatform(platform.id)}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{platform.icon}</span>
                              <span className="text-sm font-medium">{platform.name}</span>
                              {selectedPlatforms.includes(platform.id) && (
                                <CheckCircle2 className="w-4 h-4 text-blue-600 ml-auto" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* 薪资和限制 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 w-5 h-5" />
                  薪资范围 & 投递限制
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium">最低薪资 (K)</span>
                    <Input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(parseInt(e.target.value))}
                      min={0}
                      max={100}
                    />
                  </div>
                  <div>
                    <span className="text-sm font-medium">最高薪资 (K)</span>
                    <Input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(parseInt(e.target.value))}
                      min={0}
                      max={100}
                    />
                  </div>
                  <div>
                    <span className="text-sm font-medium">单次投递上限</span>
                    <Input
                      type="number"
                      value={maxApply}
                      onChange={(e) => setMaxApply(parseInt(e.target.value))}
                      min={1}
                      max={200}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleSearch}
                disabled={isSearching || !keywords.trim()}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    搜索中...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 w-5 h-5" />
                    搜索岗位 ({selectedCities.length} 个城市)
                  </>
                )}
              </Button>

              <Button
                size="lg"
                className="flex-1"
                onClick={handleApply}
                disabled={isApplying || jobs.length === 0}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    投递中...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 w-5 h-5" />
                    开始投递 ({jobs.length} 个岗位)
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 右侧：结果区域 */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>搜索 & 投递结果</CardTitle>
              </CardHeader>
              <CardContent>
                {/* 搜索结果 */}
                {jobs.length > 0 && !isApplying && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">找到 {jobs.length} 个岗位</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {jobs.slice(0, 20).map((job, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="font-medium text-sm">{job.title}</div>
                          <div className="text-xs text-gray-500">
                            {job.company} · {job.city} · {job.salary}
                          </div>
                          <div className="text-xs text-blue-500">{job.platform}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 投递进度 */}
                {isApplying && results && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">投递进度</h4>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{results.total}</div>
                        <div className="text-xs">总计</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{results.success}</div>
                        <div className="text-xs">成功</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-lg font-bold text-red-600">{results.failed}</div>
                        <div className="text-xs">失败</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 投递结果 */}
                {results && !isApplying && (
                  <div>
                    <h4 className="font-medium mb-3">投递完成</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{results.success}</div>
                        <div className="text-sm">成功</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                        <div className="text-sm">失败</div>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {results.applications.slice(0, 10).map((app: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="text-sm">
                            <div className="font-medium">{app.company}</div>
                            <div className="text-xs text-gray-500">{app.title}</div>
                          </div>
                          {app.status === "applied" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 初始状态 */}
                {!jobs.length && !isSearching && !results && (
                  <div className="text-center py-12 text-gray-400">
                    <Send className="w-12 h-12 mx-auto mb-4" />
                    <p>设置条件后搜索岗位</p>
                    <p className="text-sm mt-2">然后点击投递</p>
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
