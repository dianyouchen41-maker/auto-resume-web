import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Demo resumes data
const demoResumes = [
  {
    id: "demo-resume-1",
    fileName: "我的简历.pdf",
    fileType: "pdf",
    content: "拥有5年Python开发经验，熟悉Django、Flask、FastAPI框架。精通MySQL、PostgreSQL数据库设计与优化。有丰富的微服务架构和容器化部署经验。",
    skills: JSON.stringify(["Python", "Django", "Flask", "FastAPI", "MySQL", "PostgreSQL", "Docker"]),
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
]

// 获取简历列表
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    // Demo mode
    if (!prisma) {
      return NextResponse.json({ resumes: demoResumes })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ resumes: demoResumes })
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ resumes: resumes.length > 0 ? resumes : demoResumes })
  } catch (error) {
    console.error("Get resumes error:", error)
    return NextResponse.json({ resumes: demoResumes })
  }
}

// 上传简历
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "请选择文件" }, { status: 400 })
    }

    // 读取文件内容
    let content = ""
    const fileType = file.name.split(".").pop()?.toLowerCase() || ""

    if (fileType === "txt") {
      content = await file.text()
    } else if (fileType === "pdf") {
      content = "PDF文件已上传，请手动填写简历内容"
    } else if (fileType === "docx" || fileType === "doc") {
      content = "Word文件已上传，请手动填写简历内容"
    } else {
      return NextResponse.json({ error: "不支持的文件格式" }, { status: 400 })
    }

    // 提取技能关键词
    const skills = extractSkills(content)

    // Demo mode
    if (!prisma) {
      const newResume = {
        id: `demo-resume-${Date.now()}`,
        fileName: file.name,
        fileType,
        content,
        skills: JSON.stringify(skills),
        isDefault: false,
        createdAt: new Date().toISOString(),
      }
      return NextResponse.json({ resume: newResume }, { status: 201 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileType,
        content,
        skills: JSON.stringify(skills),
      },
    })

    return NextResponse.json({ resume }, { status: 201 })
  } catch (error) {
    console.error("Upload resume error:", error)
    return NextResponse.json({ error: "上传简历失败" }, { status: 500 })
  }
}

// 提取技能关键词
function extractSkills(content: string): string[] {
  const techKeywords = [
    "Python", "Java", "JavaScript", "TypeScript", "Go", "Rust", "C++", "C#",
    "React", "Vue", "Angular", "Node.js", "Django", "Flask", "FastAPI",
    "Spring", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Docker", "K8s",
    "AWS", "Azure", "机器学习", "深度学习", "NLP", "计算机视觉",
    "前端", "后端", "全栈", "数据分析", "大数据", "算法",
  ]

  const skills: string[] = []
  const contentUpper = content.toUpperCase()

  for (const keyword of techKeywords) {
    if (contentUpper.includes(keyword.toUpperCase())) {
      skills.push(keyword)
    }
  }

  return skills.slice(0, 10)
}
