import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 获取简历列表
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ resumes })
  } catch (error) {
    console.error("Get resumes error:", error)
    return NextResponse.json({ error: "获取简历失败" }, { status: 500 })
  }
}

// 上传简历
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
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
      // PDF 解析需要额外库，这里简化处理
      content = "PDF文件已上传，请手动填写简历内容"
    } else if (fileType === "docx" || fileType === "doc") {
      // Word 解析需要额外库，这里简化处理
      content = "Word文件已上传，请手动填写简历内容"
    } else {
      return NextResponse.json({ error: "不支持的文件格式" }, { status: 400 })
    }

    // 提取技能关键词
    const skills = extractSkills(content)

    // 保存简历
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
