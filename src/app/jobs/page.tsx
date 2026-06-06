"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ArrowLeft, MapPin, DollarSign, Briefcase, ExternalLink, Send, Loader2 } from "lucide-react"

const cities = ["北京", "上海", "广州", "深圳", "杭州", "成都", "南京", "武汉", "西安", "苏州", "长沙", "重庆"]

export default function JobsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [keyword, setKeyword] = useState("")
  const [selectedCity, setSelectedCity] = useState("北京")
  const [isSearching, setIsSearching] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) { setUser(JSON.parse(stored)) } else { router.push("/login") }
  }, [router])

  const handleSearch = () => {
    if (!keyword.trim()) return
    setIsSearching(true)
    setTimeout(() => {
      setJobs([
        { id: 1, title: `${keyword}开发工程师`, company: "字节跳动", salary: "25-40K", city: selectedCity, platform: "BOSS直聘", experience: "3-5年", education: "本科" },
        { id: 2, title: `高级${keyword}工程师`, company: "阿里巴巴", salary: "30-50K", city: selectedCity, platform: "智联招聘", experience: "5-10年", education: "本科" },
        { id: 3, title: `${keyword}架构师`, company: "腾讯", salary: "40-60K", city: selectedCity, platform: "拉勾网", experience: "5-10年", education: "硕士" },
        { id: 4, title: `${keyword}全栈开发`, company: "美团", salary: "20-35K", city: selectedCity, platform: "前程无忧", experience: "1-3年", education: "本科" },
        { id: 5, title: `资深${keyword}专家`, company: "华为", salary: "35-55K", city: selectedCity, platform: "猎聘", experience: "5-10年", education: "本科" },
        { id: 6, title: `${keyword}技术经理`, company: "小米", salary: "30-50K", city: selectedCity, platform: "脉脉", experience: "5-10年", education: "本科" },
        { id: 7, title: `${keyword}研发工程师`, company: "京东", salary: "22-38K", city: selectedCity, platform: "九金十银", experience: "3-5年", education: "本科" },
        { id: 8, title: `初级${keyword}开发`, company: "网易", salary: "15-25K", city: selectedCity, platform: "58同城", experience: "1-3年", education: "本科" },
      ])
      setIsSearching(false)
    }, 1000)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center"><Search className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">AutoResume</span>
          </Link>
          <Link href="/dashboard"><Button variant="ghost" size="sm"><ArrowLeft className="mr-2 w-4 h-4" />返回</Button></Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">岗位搜索</h1>
        <Card className="mb-8">
          <CardHeader><CardTitle>搜索条件</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Input placeholder="关键词" value={keyword} onChange={e => setKeyword(e.target.value)} />
              <select className="h-10 px-3 rounded-md border bg-background text-sm" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />搜索中...</> : <><Search className="mr-2 w-4 h-4" />搜索</>}
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {jobs.map(job => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">{job.platform}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" />{job.company}</span>
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{job.city}</span>
                      <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1" />{job.salary}</span>
                    </div>
                  </div>
                  <Button><Send className="mr-2 w-4 h-4" />投递</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
