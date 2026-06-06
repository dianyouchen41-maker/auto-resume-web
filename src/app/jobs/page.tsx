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
  Search,
  ArrowLeft,
  MapPin,
  DollarSign,
  Briefcase,
  ExternalLink,
  Send,
  Loader2
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const cities = [
  "北京", "上海", "广州", "深圳", "杭州", "成都",
  "南京", "武汉", "西安", "苏州", "长沙", "重庆",
]

const platforms = [
  { id: "all", name: "全部平台" },
  { id: "boss", name: "BOSS直聘" },
  { id: "zhilian", name: "智联招聘" },
  { id: "lagou", name: "拉勾网" },
  { id: "job51", name: "前程无忧" },
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

export default function JobsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [keyword, setKeyword] = useState("")
  const [selectedCity, setSelectedCity] = useState("北京")
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [salaryMin, setSalaryMin] = useState(0)
  const [salaryMax, setSalaryMax] = useState(100)
  const [isSearching, setIsSearching] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const handleSearch = async () => {
    if (!keyword.trim()) {
      toast({
        title: "请输入关键词",
        description: "请输入岗位搜索关键词",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)

    try {
      const params = new URLSearchParams({
        keyword,
        city: selectedCity,
        platform: selectedPlatform,
        salaryMin: (salaryMin * 1000).toString(),
        salaryMax: (salaryMax * 1000).toString(),
      })

      const response = await fetch(`/api/jobs?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "搜索失败")
      }

      setJobs(data.jobs)
    } catch (error) {
      toast({
        title: "搜索失败",
        description: error instanceof Error ? error.message : "请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const platformNames: Record<string, string> = {
    boss: "BOSS直聘",
    zhilian: "智联招聘",
    lagou: "拉勾网",
    job51: "前程无忧",
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
              <Search className="w-5 h-5 text-white" />
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
          <h1 className="text-3xl font-bold mb-2">岗位搜索</h1>
          <p className="text-gray-600 dark:text-gray-400">
            搜索符合条件的岗位
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>搜索条件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>关键词</Label>
                <Input
                  placeholder="例: Python开发"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>城市</Label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>平台</Label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  {platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>薪资范围 (K)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(parseInt(e.target.value))}
                    min={0}
                    max={100}
                    className="w-20"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(parseInt(e.target.value))}
                    min={0}
                    max={100}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
            <Button
              className="mt-4"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  搜索中...
                </>
              ) : (
                <>
                  <Search className="mr-2 w-4 h-4" />
                  搜索
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-400">
                <Briefcase className="w-16 h-16 mx-auto mb-4" />
                <p>输入条件后开始搜索</p>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs">
                          {platformNames[job.platform] || job.platform}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.company}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.city}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.salary}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{job.experience}</span>
                        <span>{job.education}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={job.url} target="_blank">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 w-4 h-4" />
                          查看
                        </Button>
                      </Link>
                      <Button size="sm">
                        <Send className="mr-2 w-4 h-4" />
                        投递
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
