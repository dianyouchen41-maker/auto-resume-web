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
  Settings,
  ArrowLeft,
  User,
  Bell,
  Shield,
  Save,
  Loader2
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
    }
  }, [status, router, session])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // 模拟保存
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "保存成功",
        description: "设置已更新",
      })
    } catch (error) {
      toast({
        title: "保存失败",
        description: "请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
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
              <Settings className="w-5 h-5 text-white" />
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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">设置</h1>
          <p className="text-gray-600 dark:text-gray-400">
            管理你的账号和偏好设置
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 w-5 h-5" />
                个人资料
              </CardTitle>
              <CardDescription>更新你的个人信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
                <p className="text-xs text-gray-500">邮箱不可修改</p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 w-5 h-5" />
                通知设置
              </CardTitle>
              <CardDescription>配置投递结果通知</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">邮件通知</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    投递完成后发送邮件通知
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  配置
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">企业微信通知</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    通过 Webhook 发送通知
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  配置
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 w-5 h-5" />
                安全设置
              </CardTitle>
              <CardDescription>管理密码和安全选项</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">修改密码</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    更新你的登录密码
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  修改
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 w-4 h-4" />
                保存设置
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
