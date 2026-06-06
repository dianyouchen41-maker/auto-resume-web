// 招聘平台注册表
export interface Platform {
  id: string
  name: string
  icon: string
  url: string
  category: "综合" | "互联网" | "校园" | "高端" | "兼职" | "海外" | "自定义"
  description: string
  enabled: boolean
  isCustom?: boolean
}

// 内置平台列表
export const BUILTIN_PLATFORMS: Platform[] = [
  // 综合类
  {
    id: "boss",
    name: "BOSS直聘",
    icon: "👔",
    url: "https://www.zhipin.com",
    category: "综合",
    description: "互联网招聘平台，直接与Boss沟通",
    enabled: true,
  },
  {
    id: "zhilian",
    name: "智联招聘",
    icon: "🏢",
    url: "https://www.zhaopin.com",
    category: "综合",
    description: "老牌综合招聘平台",
    enabled: true,
  },
  {
    id: "job51",
    name: "前程无忧",
    icon: "📋",
    url: "https://www.51job.com",
    category: "综合",
    description: "综合性招聘服务平台",
    enabled: true,
  },
  {
    id: "lagou",
    name: "拉勾网",
    icon: "🚀",
    url: "https://www.lagou.com",
    category: "互联网",
    description: "互联网招聘平台",
    enabled: true,
  },
  {
    id: "liepin",
    name: "猎聘",
    icon: "🎯",
    url: "https://www.liepin.com",
    category: "高端",
    description: "中高端人才招聘平台",
    enabled: true,
  },
  {
    id: "maimai",
    name: "脉脉",
    icon: "💬",
    url: "https://maimai.cn",
    category: "互联网",
    description: "职场社交招聘平台",
    enabled: true,
  },
  {
    id: "ganji",
    name: "赶集直招",
    icon: "🏗️",
    url: "https://www.ganji.com",
    category: "综合",
    description: "蓝领招聘平台",
    enabled: true,
  },
  {
    id: "58",
    name: "58同城",
    icon: "🏠",
    url: "https://www.58.com",
    category: "综合",
    description: "综合生活服务平台",
    enabled: true,
  },
  {
    id: "kanzhun",
    name: "看准网",
    icon: "👀",
    url: "https://www.kanzhun.com",
    category: "综合",
    description: "公司评价和招聘信息",
    enabled: true,
  },
  {
    id: "zhipin",
    name: "智联卓聘",
    icon: "💎",
    url: "https://www.zhaopin.com/zhuopin",
    category: "高端",
    description: "高端人才招聘",
    enabled: true,
  },

  // 校园/实习类
  {
    id: "yingjiesheng",
    name: "应届生求职网",
    icon: "🎓",
    url: "http://www.yingjiesheng.com",
    category: "校园",
    description: "应届毕业生求职平台",
    enabled: true,
  },
  {
    id: "shixisheng",
    name: "实习僧",
    icon: "📚",
    url: "https://www.shixiseng.com",
    category: "校园",
    description: "实习招聘平台",
    enabled: true,
  },
  {
    id: "ciwei",
    name: "刺猬实习",
    icon: "🦔",
    url: "https://www.ciweishixi.com",
    category: "校园",
    description: "大学生实习平台",
    enabled: true,
  },
  {
    id: "niuke",
    name: "牛客网",
    icon: "🐂",
    url: "https://www.nowcoder.com",
    category: "校园",
    description: "程序员求职平台",
    enabled: true,
  },

  // 互联网垂直类
  {
    id: "dajie",
    name: "大街网",
    icon: "🛣️",
    url: "https://www.dajie.com",
    category: "互联网",
    description: "年轻人社交招聘",
    enabled: true,
  },
  {
    id: "linkedin",
    name: "领英",
    icon: "💼",
    url: "https://www.linkedin.com",
    category: "海外",
    description: "全球职场社交平台",
    enabled: true,
  },
  {
    id: "indeed",
    name: "Indeed",
    icon: "🔍",
    url: "https://www.indeed.com",
    category: "海外",
    description: "全球招聘搜索引擎",
    enabled: true,
  },

  // 兼职类
  {
    id: "jianzhi",
    name: "兼职猫",
    icon: "🐱",
    url: "https://www.jianzhimao.com",
    category: "兼职",
    description: "兼职招聘平台",
    enabled: true,
  },
  {
    id: "doumi",
    name: "斗米兼职",
    icon: "🌾",
    url: "https://www.doumi.com",
    category: "兼职",
    description: "灵活用工平台",
    enabled: true,
  },

  // 垂直行业类
  {
    id: "zhipin_it",
    name: "CSDN招聘",
    icon: "💻",
    url: "https://job.csdn.net",
    category: "互联网",
    description: "IT技术人才招聘",
    enabled: true,
  },
  {
    id: "nurse",
    name: "丁香人才",
    icon: "🏥",
    url: "https://job.dxy.cn",
    category: "综合",
    description: "医疗行业招聘",
    enabled: true,
  },
  {
    id: "teacher",
    name: "万行教师",
    icon: "👨‍🏫",
    url: "https://www.job1001.com",
    category: "综合",
    description: "教育行业招聘",
    enabled: true,
  },

  // 九金十银
  {
    id: "jiujinshiyin",
    name: "九金十银",
    icon: "💰",
    url: "https://www.jiujinshiyin.com",
    category: "综合",
    description: "综合招聘平台",
    enabled: true,
  },
]

// 获取所有平台（内置 + 自定义）
export function getAllPlatforms(): Platform[] {
  if (typeof window === "undefined") return BUILTIN_PLATFORMS

  const customPlatforms = getCustomPlatforms()
  return [...BUILTIN_PLATFORMS, ...customPlatforms]
}

// 获取自定义平台
export function getCustomPlatforms(): Platform[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("custom_platforms")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// 添加自定义平台
export function addCustomPlatform(platform: Omit<Platform, "id" | "isCustom">): Platform {
  const newPlatform: Platform = {
    ...platform,
    id: "custom_" + Date.now(),
    isCustom: true,
  }

  const customPlatforms = getCustomPlatforms()
  customPlatforms.push(newPlatform)
  localStorage.setItem("custom_platforms", JSON.stringify(customPlatforms))

  return newPlatform
}

// 删除自定义平台
export function removeCustomPlatform(id: string): void {
  const customPlatforms = getCustomPlatforms().filter((p) => p.id !== id)
  localStorage.setItem("custom_platforms", JSON.stringify(customPlatforms))
}

// 更新平台启用状态
export function updatePlatformEnabled(id: string, enabled: boolean): void {
  if (typeof window === "undefined") return

  const disabledPlatforms = getDisabledPlatforms()
  if (enabled) {
    const filtered = disabledPlatforms.filter((pid) => pid !== id)
    localStorage.setItem("disabled_platforms", JSON.stringify(filtered))
  } else {
    disabledPlatforms.push(id)
    localStorage.setItem("disabled_platforms", JSON.stringify(disabledPlatforms))
  }
}

// 获取禁用的平台ID列表
export function getDisabledPlatforms(): string[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("disabled_platforms")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// 获取启用的平台列表
export function getEnabledPlatforms(): Platform[] {
  const all = getAllPlatforms()
  const disabled = getDisabledPlatforms()
  return all.filter((p) => !disabled.includes(p.id))
}

// 按分类获取平台
export function getPlatformsByCategory(): Record<string, Platform[]> {
  const all = getAllPlatforms()
  const grouped: Record<string, Platform[]> = {}

  for (const platform of all) {
    const cat = platform.category || "其他"
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(platform)
  }

  return grouped
}
