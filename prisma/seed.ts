import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 01 工作
  const workTask = await prisma.task.create({
    data: {
      title: '01 工作',
      description: '工作任务汇总',
      priority: 'high',
      tags: '工作',
      order: 1,
    },
  })

  await prisma.task.createMany({
    data: [
      {
        title: '① Prompt',
        description: 'https://github.com/Leey21/awesome-ai-research-...',
        priority: 'high',
        tags: 'AI,Prompt',
        parentId: workTask.id,
        order: 1,
      },
      {
        title: '② 课本',
        description: '博士学姐的科研"划水"指南',
        priority: 'medium',
        tags: '学习,科研',
        parentId: workTask.id,
        order: 2,
      },
      {
        title: '③ 实验',
        description: '荧光显微镜',
        priority: 'high',
        tags: '实验,显微镜',
        parentId: workTask.id,
        order: 3,
      },
      {
        title: '④ 生信',
        description: 'flowjo',
        priority: 'medium',
        tags: '生信,软件',
        parentId: workTask.id,
        order: 4,
      },
    ],
  })

  // 02 管理
  const manageTask = await prisma.task.create({
    data: {
      title: '02 管理',
      description: '自我管理任务',
      priority: 'medium',
      tags: '管理',
      order: 2,
    },
  })

  await prisma.task.createMany({
    data: [
      {
        title: '① 人生',
        description: '具体话术："我想请你帮我一下，你更方便给我A建...',
        priority: 'medium',
        tags: '人生,沟通',
        parentId: manageTask.id,
        order: 1,
      },
      {
        title: '② 表达管理',
        description: '逻辑',
        priority: 'medium',
        tags: '表达,逻辑',
        parentId: manageTask.id,
        order: 2,
      },
      {
        title: '③ 情绪',
        description: '情绪管理',
        priority: 'medium',
        tags: '情绪',
        parentId: manageTask.id,
        order: 3,
      },
      {
        title: '④ 学习',
        description: '马斯克工作五步法',
        priority: 'high',
        tags: '学习,方法',
        parentId: manageTask.id,
        order: 4,
      },
    ],
  })

  // 03 灵魂
  await prisma.task.create({
    data: {
      title: '03 灵魂',
      description: '星期二 1月',
      priority: 'low',
      tags: '灵魂,生活',
      order: 3,
    },
  })

  // 04 读书
  await prisma.task.create({
    data: {
      title: '04 读书',
      description: '2026/2/9 你是窗外另外一片风景',
      priority: 'medium',
      tags: '读书,阅读',
      order: 4,
    },
  })

  // 05 特殊
  await prisma.task.create({
    data: {
      title: '05 特殊',
      description: '送文件：这是xxx，请查收',
      priority: 'high',
      tags: '特殊,文件',
      order: 5,
    },
  })

  // 06 普通
  await prisma.task.create({
    data: {
      title: '06 普通',
      description: '核心：抓住要点开启话题',
      priority: 'low',
      tags: '普通,沟通',
      order: 6,
    },
  })

  // 07 搭配
  const outfitTask = await prisma.task.create({
    data: {
      title: '07 搭配',
      description: '穿搭管理',
      priority: 'low',
      tags: '搭配,穿搭',
      order: 7,
    },
  })

  await prisma.task.create({
    data: {
      title: '7.1 搭配',
      description: '新衣服',
      priority: 'low',
      tags: '搭配,购物',
      parentId: outfitTask.id,
      order: 1,
    },
  })

  console.log('✅ 任务创建成功！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
