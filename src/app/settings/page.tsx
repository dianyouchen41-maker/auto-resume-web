"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, ArrowLeft, User, Bell, Shield, Save, Loader2, Send } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      setName(u.name || "")
    } else {
      router.push("/login")
    }
  }, [router])

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      const updated = { ...user, name }
      localStorage.setItem("user", JSON.stringify(updated))
      setUser(updated)
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">设置</h1>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center"><User className="mr-2 w-5 h-5" />个人资料</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><span className="text-sm font-medium">姓名</span><Input value={name} onChange={e => setName(e.target.value)} /></div>
              <div><span className="text-sm font-medium">邮箱</span><Input value={user.email} disabled /><p className="text-xs text-gray-500 mt-1">邮箱不可修改</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center"><Bell className="mr-2 w-5 h-5" />通知设置</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between"><div><div className="font-medium">邮件通知</div><div className="text-sm text-gray-600">投递完成后发送通知</div></div><Button variant="outline" size="sm">配置</Button></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center"><Shield className="mr-2 w-5 h-5" />安全设置</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between"><div><div className="font-medium">修改密码</div><div className="text-sm text-gray-600">更新登录密码</div></div><Button variant="outline" size="sm">修改</Button></div>
            </CardContent>
          </Card>
          <Button className="w-full" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />保存中...</>
            : saved ? "✅ 已保存"
            : <><Save className="mr-2 w-4 h-4" />保存设置</>}
          </Button>
        </div>
      </main>
    </div>
  )
}
