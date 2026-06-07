// 岗位数据抓取模块
// 通过代理API获取各平台真实岗位数据

export interface JobResult {
  id: string
  title: string
  company: string
  salary: string
  city: string
  experience: string
  education: string
  platform: string
  url: string
  description?: string
  tags?: string[]
}

// 通过 SerpAPI / 搜索引擎获取岗位信息
async function searchJobsViaSerpApi(keyword: string, city: string): Promise<JobResult[]> {
  // 使用多个搜索源获取岗位
  const queries = [
    `${keyword} 招聘 ${city} site:zhipin.com`,
    `${keyword} 招聘 ${city} site:zhaopin.com`,
    `${keyword} 招聘 ${city} site:51job.com`,
    `${keyword} 招聘 ${city} site:lagou.com`,
  ]

  const allJobs: JobResult[] = []

  // 使用 Google/Bing 搜索获取岗位链接
  for (const query of queries) {
    try {
      const jobs = await scrapeFromSearchEngine(query, keyword, city)
      allJobs.push(...jobs)
    } catch (error) {
      console.error(`Search failed for: ${query}`, error)
    }
  }

  return allJobs
}

// 从搜索引擎结果中提取岗位
async function scrapeFromSearchEngine(query: string, keyword: string, city: string): Promise<JobResult[]> {
  const jobs: JobResult[] = []

  try {
    // 使用 Bing 搜索
    const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=10`
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      }
    })

    if (!response.ok) return jobs

    const html = await response.text()

    // 解析搜索结果
    const results = parseSearchResults(html, keyword, city)
    jobs.push(...results)
  } catch (error) {
    console.error('Search engine scraping failed:', error)
  }

  return jobs
}

// 解析搜索结果HTML
function parseSearchResults(html: string, keyword: string, city: string): JobResult[] {
  const jobs: JobResult[] = []

  // 提取职位标题和公司
  const titlePatterns = [
    /class="b_algo"[^>]*>.*?<h2[^>]*><a[^>]*>(.*?)<\/a>/g,
    /<h2[^>]*class="b_topTitle"[^>]*><a[^>]*>(.*?)<\/a>/g,
  ]

  // 简单解析 - 实际项目中应该用更完善的解析器
  const matches = html.match(/<li class="b_algo">[\s\S]*?<\/li>/g) || []

  for (let i = 0; i < Math.min(matches.length, 10); i++) {
    const match = matches[i]
    const titleMatch = match.match(/<a[^>]*>(.*?)<\/a>/)
    const snippetMatch = match.match(/<p[^>]*>([\s\S]*?)<\/p>/)

    if (titleMatch) {
      const title = titleMatch[1].replace(/<[^>]*>/g, '').trim()
      const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, '').trim() : ''

      // 从摘要中提取公司名和薪资
      const companyMatch = snippet.match(/^([^·\-|]+)/)
      const salaryMatch = snippet.match(/(\d+[\-~]\d+[kK万]?)/)

      jobs.push({
        id: `job-${Date.now()}-${i}`,
        title: extractJobTitle(title),
        company: companyMatch ? companyMatch[1].trim().substring(0, 20) : '未知公司',
        salary: salaryMatch ? salaryMatch[1] : '面议',
        city: city,
        experience: extractExperience(snippet),
        education: '本科',
        platform: detectPlatform(title + snippet),
        url: extractUrl(match) || '#',
        description: snippet.substring(0, 100),
      })
    }
  }

  return jobs
}

// 提取职位标题
function extractJobTitle(text: string): string {
  // 移除公司名等无关信息
  const cleaned = text
    .replace(/^.*?[-–—|].*?[-–—|]/, '')
    .replace(/\d+[kK万].*$/, '')
    .replace(/招聘|急聘|高薪/g, '')
    .trim()

  return cleaned.substring(0, 30) || '开发工程师'
}

// 提取经验要求
function extractExperience(text: string): string {
  const match = text.match(/(\d+[\-~]\d+年|应届|经验不限)/)
  return match ? match[1] : '不限'
}

// 检测来源平台
function detectPlatform(text: string): string {
  if (text.includes('BOSS') || text.includes('boss') || text.includes('zhipin')) return 'BOSS直聘'
  if (text.includes('智联') || text.includes('zhaopin')) return '智联招聘'
  if (text.includes('前程') || text.includes('51job')) return '前程无忧'
  if (text.includes('拉勾') || text.includes('lagou')) return '拉勾网'
  if (text.includes('猎聘') || text.includes('liepin')) return '猎聘'
  if (text.includes('脉脉') || text.includes('maimai')) return '脉脉'
  return '综合招聘'
}

// 提取URL
function extractUrl(html: string): string {
  const match = html.match(/href="(https?:\/\/[^"]+)"/)
  return match ? match[1] : ''
}

// 主搜索函数 - 从多个来源获取岗位
export async function searchRealJobs(keyword: string, city: string, platform: string = 'all'): Promise<JobResult[]> {
  const allJobs: JobResult[] = []

  // 方式1: 通过搜索引擎获取
  try {
    const searchJobs = await searchJobsViaSerpApi(keyword, city)
    allJobs.push(...searchJobs)
  } catch (error) {
    console.error('Search engine scraping failed:', error)
  }

  // 方式2: 通过各平台公开API/页面获取
  const platformScrapers = [
    scrapeZhipinJobs,
    scrapeZhaopinJobs,
    scrape51jobJobs,
    scrapeLagouJobs,
  ]

  for (const scraper of platformScrapers) {
    try {
      const jobs = await scraper(keyword, city)
      allJobs.push(...jobs)
    } catch (error) {
      console.error('Platform scraping failed:', error)
    }
  }

  // 去重
  const uniqueJobs = deduplicateJobs(allJobs)

  // 按平台筛选
  if (platform !== 'all') {
    return uniqueJobs.filter(j => j.platform === platform)
  }

  return uniqueJobs.slice(0, 20) // 限制返回数量
}

// BOSS直聘岗位抓取
async function scrapeZhipinJobs(keyword: string, city: string): Promise<JobResult[]> {
  const jobs: JobResult[] = []

  try {
    const cityCode = getZhipinCityCode(city)
    const url = `https://www.zhipin.com/web/geek/job?query=${encodeURIComponent(keyword)}&city=${cityCode}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Referer': 'https://www.zhipin.com/',
      }
    })

    if (!response.ok) return jobs

    const html = await response.text()

    // 解析职位卡片
    const cardRegex = /<div class="job-card-wrapper">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g
    let match

    while ((match = cardRegex.exec(html)) !== null && jobs.length < 10) {
      const card = match[1]

      const titleMatch = card.match(/<span class="job-name">(.*?)<\/span>/)
      const companyMatch = card.match(/<span class="company-name">(.*?)<\/span>/)
      const salaryMatch = card.match(/<span class="salary">(.*?)<\/span>/)
      const areaMatch = card.match(/<span class="job-area">(.*?)<\/span>/)
      const linkMatch = card.match(/href="(\/job\/[^"]+)"/)

      if (titleMatch) {
        jobs.push({
          id: `boss-${Date.now()}-${jobs.length}`,
          title: titleMatch[1].trim(),
          company: companyMatch ? companyMatch[1].trim() : '未知',
          salary: salaryMatch ? salaryMatch[1].trim() : '面议',
          city: areaMatch ? areaMatch[1].trim().split('·')[0].trim() : city,
          experience: areaMatch ? (areaMatch[1].match(/\d+[\-~]\d+年/)?.[0] || '不限') : '不限',
          education: '本科',
          platform: 'BOSS直聘',
          url: linkMatch ? `https://www.zhipin.com${linkMatch[1]}` : '#',
        })
      }
    }
  } catch (error) {
    console.error('BOSS直聘抓取失败:', error)
  }

  return jobs
}

// 智联招聘岗位抓取
async function scrapeZhaopinJobs(keyword: string, city: string): Promise<JobResult[]> {
  const jobs: JobResult[] = []

  try {
    const cityCode = getZhaopinCityCode(city)
    const url = `https://sou.zhaopin.com/?jl=${cityCode}&kw=${encodeURIComponent(keyword)}&p=1`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    })

    if (!response.ok) return jobs

    const html = await response.text()

    // 解析职位列表
    const itemRegex = /<div class="joblist-box__item">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g
    let match

    while ((match = itemRegex.exec(html)) !== null && jobs.length < 10) {
      const item = match[1]

      const titleMatch = item.match(/<a[^>]*class="iteminfo__line1__jobname"[^>]*>(.*?)<\/a>/)
      const companyMatch = item.match(/<a[^>]*class="iteminfo__line1__compname"[^>]*>(.*?)<\/a>/)
      const salaryMatch = item.match(/<p class="iteminfo__line2__jobdesc__salary">(.*?)<\/p>/)

      if (titleMatch) {
        jobs.push({
          id: `zhilian-${Date.now()}-${jobs.length}`,
          title: titleMatch[1].trim(),
          company: companyMatch ? companyMatch[1].trim() : '未知',
          salary: salaryMatch ? salaryMatch[1].trim() : '面议',
          city: city,
          experience: '不限',
          education: '本科',
          platform: '智联招聘',
          url: '#',
        })
      }
    }
  } catch (error) {
    console.error('智联招聘抓取失败:', error)
  }

  return jobs
}

// 前程无忧岗位抓取
async function scrape51jobJobs(keyword: string, city: string): Promise<JobResult[]> {
  const jobs: JobResult[] = []

  try {
    const url = `https://search.51job.com/list/000000,000000,0000,00,9,99,${encodeURIComponent(keyword)},2,1.html`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    })

    if (!response.ok) return jobs

    const html = await response.text()

    // 解析职位列表
    const itemRegex = /<div class="j_joblist">([\s\S]*?)<\/div>\s*<\/div>/g
    let match

    while ((match = itemRegex.exec(html)) !== null && jobs.length < 10) {
      const item = match[1]

      const titleMatch = item.match(/<a[^>]*class="jname"[^>]*>(.*?)<\/a>/)
      const companyMatch = item.match(/<a[^>]*class="cname"[^>]*>(.*?)<\/a>/)
      const salaryMatch = item.match(/<span class="sal">(.*?)<\/span>/)

      if (titleMatch) {
        jobs.push({
          id: `51job-${Date.now()}-${jobs.length}`,
          title: titleMatch[1].trim(),
          company: companyMatch ? companyMatch[1].trim() : '未知',
          salary: salaryMatch ? salaryMatch[1].trim() : '面议',
          city: city,
          experience: '不限',
          education: '本科',
          platform: '前程无忧',
          url: '#',
        })
      }
    }
  } catch (error) {
    console.error('前程无忧抓取失败:', error)
  }

  return jobs
}

// 拉勾网岗位抓取
async function scrapeLagouJobs(keyword: string, city: string): Promise<JobResult[]> {
  const jobs: JobResult[] = []

  try {
    const url = `https://www.lagou.com/jobs/list_${encodeURIComponent(keyword)}?city=${encodeURIComponent(city)}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    })

    if (!response.ok) return jobs

    const html = await response.text()

    // 解析职位列表
    const itemRegex = /<div class="s_position_item">([\s\S]*?)<\/div>\s*<\/div>/g
    let match

    while ((match = itemRegex.exec(html)) !== null && jobs.length < 10) {
      const item = match[1]

      const titleMatch = item.match(/<a[^>]*class="position_link"[^>]*>(.*?)<\/a>/)
      const companyMatch = item.match(/<a[^>]*class="company_name"[^>]*>(.*?)<\/a>/)
      const salaryMatch = item.match(/<span class="money">(.*?)<\/span>/)

      if (titleMatch) {
        jobs.push({
          id: `lagou-${Date.now()}-${jobs.length}`,
          title: titleMatch[1].trim(),
          company: companyMatch ? companyMatch[1].trim() : '未知',
          salary: salaryMatch ? salaryMatch[1].trim() : '面议',
          city: city,
          experience: '不限',
          education: '本科',
          platform: '拉勾网',
          url: '#',
        })
      }
    }
  } catch (error) {
    console.error('拉勾网抓取失败:', error)
  }

  return jobs
}

// 去重
function deduplicateJobs(jobs: JobResult[]): JobResult[] {
  const seen = new Set<string>()
  return jobs.filter(job => {
    const key = `${job.title}-${job.company}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// 城市代码映射
function getZhipinCityCode(city: string): string {
  const codes: Record<string, string> = {
    '北京': '101010100', '上海': '101020100', '广州': '101280100',
    '深圳': '101280600', '杭州': '101210100', '成都': '101270100',
    '南京': '101190100', '武汉': '101200100', '西安': '101110100',
    '苏州': '101190400', '长沙': '101250100', '重庆': '101040100',
  }
  return codes[city] || '101010100'
}

function getZhaopinCityCode(city: string): string {
  const codes: Record<string, string> = {
    '北京': '530', '上海': '538', '广州': '763',
    '深圳': '765', '杭州': '653', '成都': '801',
    '南京': '635', '武汉': '736', '西安': '854',
  }
  return codes[city] || '530'
}
