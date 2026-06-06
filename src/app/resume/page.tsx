"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  ArrowLeft,
  Upload,
  Trash2,
  Eye,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Resume {
  id: string
  fileName: string
  fileType: string
  content: string
  skills: string
  isDefault: boolean
  createdAt: string
}

export default function ResumePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
    if (status === "authenticated") {
      fetchResumes()
    }
  }, [status, router])

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resume")
      const data = await response.json()
      if (data.resumes) {
        setResumes(data.resumes)
      }
    } catch (error) {
      console.error("Fetch resumes error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = [".pdf", ".doc", ".docx", ".txt"]
    const fileType = "." + file.name.split(".").pop()?.toLowerCase()
    if (!allowedTypes.includes(fileType)) {
      toast({
        title: "不支持的文件格式",
        description: "请上传 PDF、Word 或 TXT 文件",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "上传失败")
      }

      toast({
        title: "上传成功",
        description: "简历已成功上传并解析",
      })

      fetchResumes()
    } catch (error) {
      toast({
        title: "上传失败",
        description: error instanceof Error ? error.message : "请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这份简历吗？")) return

    try {
      const response = await fetch(`/api/resume/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "删除成功",
          description: "简历已删除",
        })
        fetchResumes()
      }
    } catch (error) {
      toast({
        title: "删除失败",
        description: "请稍后再试",
        variant: "destructive",
      })
    }
  }

  const parseSkills = (skillsJson: string): string[] => {
    try {
      return JSON.parse(skillsJson)
    } catch {
      return []
    }
  }

  if (status === "loading" || isLoading) {
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
              <FileText className="w-5 h-5 text-white" />
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
          <h1 className="text-3xl font-bold mb-2">简历管理</h1>
          <p className="text-gray-600 dark:text-gray-400">
            上传和管理你的简历
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>上传简历</CardTitle>
                <CardDescription>支持 PDF、Word、TXT 格式</CardDescription>
              </CardHeader>
              <CardContent>
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleUpload}
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <>
                      <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">上传中...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">点击或拖拽上传</p>
                      <p className="text-sm text-gray-400">PDF, DOC, DOCX, TXT</p>
                    </>
                  )}
                </label>
              </CardContent>
            </Card>

            {/* Resume List */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>我的简历</CardTitle>
                <CardDescription>已上传 {resumes.length} 份简历</CardDescription>
              </CardHeader>
              <CardContent>
                {resumes.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <p>暂无简历</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resumes.map((resume) => (
                      <div
                        key={resume.id}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedResume?.id === resume.id
                            ? "border-primary bg-primary/5"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setSelectedResume(resume)}
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-sm">{resume.fileName}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(resume.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {resume.isDefault && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(resume.id)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-2">
            <Card className="min-h-[600px]">
              <CardHeader>
                <CardTitle>简历预览</CardTitle>
                <CardDescription>
                  {selectedResume ? selectedResume.fileName : "选择一份简历查看"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedResume ? (
                  <div className="space-y-6">
                    {/* Skills */}
                    <div>
                      <h3 className="font-medium mb-3">技能关键词</h3>
                      <div className="flex flex-wrap gap-2">
                        {parseSkills(selectedResume.skills).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                        {parseSkills(selectedResume.skills).length === 0 && (
                          <span className="text-gray-400">未检测到技能关键词</span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-medium mb-3">简历内容</h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg whitespace-pre-wrap text-sm">
                        {selectedResume.content || "暂无内容"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                    <Eye className="w-16 h-16 mb-4" />
                    <p>选择一份简历查看预览</p>
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
