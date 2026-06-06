"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, ArrowLeft, Search, MapPin, DollarSign, Briefcase, CheckCircle2, XCircle, Loader2, Plus, Settings } from "lucide-react"
import { getAllPlatforms, getEnabledPlatforms, updatePlatformEnabled, addCustomPlatform, getPlatformsByCategory, type Platform } from "@/lib/platforms"

const cities = ["北京", "上海", "广州", "深圳", "杭州", "成都", "南京", "武汉", "西安", "苏州", "长沙", "重庆", "天津", "郑州", "合肥", "青岛", "厦门", "大连"]

export default function ApplyPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [keywords, setKeywords] = useState("")
  const [selectedCities, setSelectedCities] = useState(["北京", "上海"])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [salaryMin, setSalaryMin] = useState(15)
  const [salaryMax, setSalaryMax] = useState(30)
  const [maxApply, setMaxApply] = useState(20)
  const [isApplying, setIsApplying] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [platformsByCategory, setPlatformsByCategory] = useState<Record<string, Platform[]>>({})
  const [showAddPlatform, setShowAddPlatform] = useState(false)
  const [newPlatform, setNewPlatform] = useState({ name: "", url: "", icon: "🌐", category: "自定义" as const, description: "", enabled: true })

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      setUser(JSON.parse(stored))
      const enabled = getEnabledPlatforms()
      setPlatforms(enabled)
      setPlatformsByCategory(getPlatformsByCategory())
      setSelectedPlatforms(enabled.slice(0, 4).map((p) => p.id))
    } else {
      router.push("/login")
    }
  }, [router])

  const toggleCity = (c: string) => setSelectedCities((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  const togglePlatform = (p: string) => setSelectedPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))

  const handleAddPlatform = () => {
    if (!newPlatform.name || !newPlatform.url) return
    addCustomPlatform(newPlatform)
    setPlatforms(getEnabledPlatforms())
    setPlatformsByCategory(getPlatformsByCategory())
    setNewPlatform({ name: "", url: "", icon: "🌐", category: "自定义", description: "", enabled: true })
    setShowAddPlatform(false)
  }

  const handleApply = () => {
    if (!keywords.trim() || selectedCities.length === 0 || selectedPlatforms.length === 0) return
    setIsApplying(true)
    setTimeout(() => {
      setResults({
        success: 8,
        failed: 2,
        applications: [
          { company: "字节跳动", jobTitle: "前端开发工程师", salary: "25-40K", status: "applied" },
          { company: "阿里巴巴", jobTitle: "全栈开发", salary: "30-50K", status: "applied" },
          { company: "腾讯", jobTitle: "后端开发", salary: "28-45K", status: "applied" },
          { company: "美团", jobTitle: "Java开发", salary: "22-35K", status: "failed" },
        ],
      })
      setIsApplying(false)
    }, 3000)
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
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 w-5 h-5" />
                  搜索关键词
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input placeholder="例: Python开发, 后端开发" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 w-5 h-5" />
                  意向城市
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cities.map((c) => (
                    <Button key={c} variant={selectedCities.includes(c) ? "default" : "outline"} size="sm" onClick={() => toggleCity(c)}>
                      {c}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 w-5 h-5" />
                    投递平台
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowAddPlatform(!showAddPlatform)}>
                    <Plus className="mr-2 w-4 h-4" />
                    添加平台
                  </Button>
                </div>
                <CardDescription>已选择 {selectedPlatforms.length} 个平台</CardDescription>
              </CardHeader>
              <CardContent>
                {showAddPlatform && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-3">添加自定义平台</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <Input placeholder="平台名称" value={newPlatform.name} onChange={(e) => setNewPlatform({ ...newPlatform, name: e.target.value })} />
                      <Input placeholder="平台网址" value={newPlatform.url} onChange={(e) => setNewPlatform({ ...newPlatform, url: e.target.value })} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddPlatform}>添加</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAddPlatform(false)}>取消</Button>
                    </div>
                  </div>
                )}
                {Object.entries(platformsByCategory).map(([category, categoryPlatforms]) => (
                  <div key={category} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">{category}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categoryPlatforms.map((p) => (
                        <div
                          key={p.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedPlatforms.includes(p.id) ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => togglePlatform(p.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{p.icon}</span>
                            <span className="text-sm font-medium">{p.name}</span>
                            {selectedPlatforms.includes(p.id) && <CheckCircle2 className="w-4 h-4 text-blue-600 ml-auto" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 w-5 h-5" />
                  薪资 & 限制
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm">最低(K)</span>
                    <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(parseInt(e.target.value))} />
                  </div>
                  <div>
                    <span className="text-sm">最高(K)</span>
                    <Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(parseInt(e.target.value))} />
                  </div>
                  <div>
                    <span className="text-sm">上限</span>
                    <Input type="number" value={maxApply} onChange={(e) => setMaxApply(parseInt(e.target.value))} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button size="lg" className="w-full" onClick={handleApply} disabled={isApplying}>
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  投递中...
                </>
              ) : (
                <>
                  <Send className="mr-2 w-5 h-5" />
                  开始投递 ({selectedPlatforms.length} 个平台)
                </>
              )}
            </Button>
          </div>
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>投递结果</CardTitle>
              </CardHeader>
              <CardContent>
                {isApplying ? (
                  <div className="flex flex-col items-center py-12">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p>投递中...</p>
                  </div>
                ) : results ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{results.success}</div>
                        <div className="text-sm">成功</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                        <div className="text-sm">失败</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {results.applications.map((app: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{app.company}</div>
                            <div className="text-sm text-gray-600">{app.jobTitle}</div>
                          </div>
                          {app.status === "applied" ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-12 text-gray-400">
                    <Send className="w-12 h-12 mb-4" />
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
