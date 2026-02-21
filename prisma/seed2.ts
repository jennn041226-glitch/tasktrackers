import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 获取当前最大 order
  const lastTask = await prisma.task.findFirst({
    where: { parentId: null },
    orderBy: { order: 'desc' },
  })
  const startOrder = (lastTask?.order || 0) + 1

  // 添加新的一级任务
  await prisma.task.createMany({
    data: [
      {
        title: '08 穷',
        description: '',
        priority: 'low',
        tags: '',
        order: startOrder,
      },
      {
        title: '09 电脑',
        description: '',
        priority: 'medium',
        tags: '',
        order: startOrder + 1,
      },
      {
        title: '10 运动',
        description: '',
        priority: 'medium',
        tags: '',
        order: startOrder + 2,
      },
      {
        title: '11 化妆',
        description: '',
        priority: 'low',
        tags: '',
        order: startOrder + 3,
      },
      {
        title: '12 重复',
        description: '',
        priority: 'low',
        tags: '',
        order: startOrder + 4,
      },
      {
        title: '13 视频',
        description: '',
        priority: 'medium',
        tags: '',
        order: startOrder + 5,
      },
      {
        title: '14 人际交往',
        description: '',
        priority: 'high',
        tags: '',
        order: startOrder + 6,
      },
      {
        title: '15 支付',
        description: '',
        priority: 'medium',
        tags: '',
        order: startOrder + 7,
      },
      {
        title: '16 高级选择',
        description: '',
        priority: 'high',
        tags: '',
        order: startOrder + 8,
      },
      {
        title: '17 兜底',
        description: '',
        priority: 'medium',
        tags: '',
        order: startOrder + 9,
      },
      {
        title: '18 通用回怼',
        description: '',
        priority: 'high',
        tags: '',
        order: startOrder + 10,
      },
    ],
  })

  console.log('✅ 新任务创建成功！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
