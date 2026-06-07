"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ArrowLeft, MapPin, DollarSign, Briefcase, ExternalLink, Send, Loader2, RefreshCw } from "lucide-react"

const cities = ["北京", "上海", "广州", "深圳", "杭州", "成都", "南京", "武汉", "西安", "苏州", "长沙", "重庆"]

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
  description?: string
}

export default function JobsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [keyword, setKeyword] = useState("")
  const [selectedCity, setSelectedCity] = useState("北京")
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError("请输入搜索关键词")
      return
    }

    setIsSearching(true)
    setError("")
    setSearched(true)

    try {
      const params = new URLSearchParams({
        keyword: keyword.trim(),
        city: selectedCity,
        platform: selectedPlatform,
      })

      const response = await fetch(`/api/jobs/search?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "搜索失败")
      }

      setJobs(data.jobs || [])

      if (data.jobs.length === 0) {
        setError("未找到相关岗位，请尝试其他关键词")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "搜索失败，请稍后再试")
      setJobs([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
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
        <h1 className="text-3xl font-bold mb-8">岗位搜索</h1>

        {/* 搜索条件 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>搜索条件</CardTitle>
            <CardDescription>从各大招聘平台实时搜索真实岗位</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="输入岗位关键词，如：Python开发、前端、产品经理..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-base"
                />
              </div>
              <select
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="all">全部平台</option>
                <option value="BOSS直聘">BOSS直聘</option>
                <option value="智联招聘">智联招聘</option>
                <option value="前程无忧">前程无忧</option>
                <option value="拉勾网">拉勾网</option>
                <option value="猎聘">猎聘</option>
              </select>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSearch} disabled={isSearching} className="px-8">
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    搜索中...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 w-4 h-4" />
                    搜索岗位
                  </>
                )}
              </Button>
              {jobs.length > 0 && (
                <Button variant="outline" onClick={handleSearch} disabled={isSearching}>
                  <RefreshCw className="mr-2 w-4 h-4" />
                  刷新
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* 搜索结果 */}
        {searched && !isSearching && jobs.length > 0 && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            找到 <span className="font-semibold text-blue-600">{jobs.length}</span> 个岗位
          </div>
        )}

        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                        {job.platform}
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
                      {job.experience && job.experience !== "不限" && (
                        <span className="text-gray-500">{job.experience}</span>
                      )}
                    </div>
                    {job.description && (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{job.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {job.url && job.url !== "#" && (
                      <Link href={job.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 w-4 h-4" />
                          查看
                        </Button>
                      </Link>
                    )}
                    <Button size="sm">
                      <Send className="mr-2 w-4 h-4" />
                      投递
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 空状态 */}
        {searched && !isSearching && jobs.length === 0 && !error && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">未找到相关岗位</h3>
              <p className="text-gray-500 dark:text-gray-400">请尝试其他关键词或城市</p>
            </CardContent>
          </Card>
        )}

        {/* 初始状态 */}
        {!searched && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">开始搜索岗位</h3>
              <p className="text-gray-500 dark:text-gray-400">输入关键词，从各招聘平台实时获取真实岗位信息</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
