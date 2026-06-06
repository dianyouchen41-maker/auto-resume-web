"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft, Upload, Trash2, Eye, Loader2, Send } from "lucide-react"

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
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: "demo-1",
      fileName: "示例简历.pdf",
      fileType: "pdf",
      content: "拥有5年Python开发经验，熟悉Django、Flask、FastAPI框架。精通MySQL、PostgreSQL数据库设计与优化。",
      skills: JSON.stringify(["Python", "Django", "Flask", "FastAPI", "MySQL"]),
      isDefault: true,
      createdAt: new Date().toISOString(),
    }
  ])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setTimeout(() => {
      const newResume: Resume = {
        id: "resume-" + Date.now(),
        fileName: file.name,
        fileType: file.name.split(".").pop() || "txt",
        content: "简历内容已上传",
        skills: JSON.stringify(["JavaScript", "React", "Node.js"]),
        isDefault: false,
        createdAt: new Date().toISOString(),
      }
      setResumes([newResume, ...resumes])
      setIsUploading(false)
    }, 1500)
  }

  const handleDelete = (id: string) => {
    setResumes(resumes.filter(r => r.id !== id))
    if (selectedResume?.id === id) setSelectedResume(null)
  }

  const parseSkills = (skillsJson: string): string[] => {
    try { return JSON.parse(skillsJson) } catch { return [] }
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
            <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 w-4 h-4" />返回</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">简历管理</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>上传简历</CardTitle>
                <CardDescription>支持 PDF、Word、TXT 格式</CardDescription>
              </CardHeader>
              <CardContent>
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleUpload} disabled={isUploading} />
                  {isUploading ? (
                    <><Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" /><p>上传中...</p></>
                  ) : (
                    <><Upload className="w-12 h-12 text-gray-400 mb-4" /><p>点击上传</p></>
                  )}
                </label>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>我的简历</CardTitle>
                <CardDescription>已上传 {resumes.length} 份</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <div key={resume.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedResume?.id === resume.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                      onClick={() => setSelectedResume(resume)}>
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-sm">{resume.fileName}</div>
                          <div className="text-xs text-gray-500">{new Date(resume.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDelete(resume.id); }}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="min-h-[600px]">
              <CardHeader>
                <CardTitle>简历预览</CardTitle>
                <CardDescription>{selectedResume ? selectedResume.fileName : "选择一份简历查看"}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedResume ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">技能关键词</h3>
                      <div className="flex flex-wrap gap-2">
                        {parseSkills(selectedResume.skills).map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full text-sm">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3">简历内容</h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg whitespace-pre-wrap text-sm">{selectedResume.content}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                    <Eye className="w-16 h-16 mb-4" /><p>选择简历查看</p>
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
