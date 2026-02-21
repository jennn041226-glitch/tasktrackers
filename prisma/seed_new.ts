import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 删除所有现有任务（先删除历史记录，再删除任务）
  await prisma.taskHistory.deleteMany()
  await prisma.task.deleteMany()

  console.log('✅ 已清空所有任务')

  // 01 工作 + 4个子任务
  const workTask = await prisma.task.create({
    data: {
      title: '01 工作',
      description: '',
      priority: 'high',
      tags: '工作',
      order: 1,
    },
  })

  await prisma.task.createMany({
    data: [
      { title: '① Prompt', description: '', priority: 'high', tags: 'AI,Prompt', parentId: workTask.id, order: 1 },
      { title: '② 课本', description: '科研"划水"指南', priority: 'medium', tags: '学习', parentId: workTask.id, order: 2 },
      { title: '③ 实验', description: '荧光显微镜', priority: 'high', tags: '实验', parentId: workTask.id, order: 3 },
      { title: '④ 生信', description: 'flowjo', priority: 'medium', tags: '生信', parentId: workTask.id, order: 4 },
    ],
  })

  // 02 管理 + 4个子任务
  const manageTask = await prisma.task.create({
    data: {
      title: '02 管理',
      description: '',
      priority: 'medium',
      tags: '管理',
      order: 2,
    },
  })

  await prisma.task.createMany({
    data: [
      { title: '① 人生', description: '', priority: 'medium', tags: '人生', parentId: manageTask.id, order: 1 },
      { title: '② 表达管理：逻辑', description: '', priority: 'medium', tags: '表达', parentId: manageTask.id, order: 2 },
      { title: '③ 情绪', description: '', priority: 'medium', tags: '情绪', parentId: manageTask.id, order: 3 },
      { title: '④ 学习', description: '马斯克工作五步法', priority: 'high', tags: '学习', parentId: manageTask.id, order: 4 },
    ],
  })

  // 03 灵魂（一级）
  await prisma.task.create({
    data: { title: '03 灵魂', description: '', priority: 'low', tags: '', order: 3 },
  })

  // 04 读书（一级）
  await prisma.task.create({
    data: { title: '04 读书', description: '', priority: 'medium', tags: '读书', order: 4 },
  })

  // 05 特殊（一级）
  await prisma.task.create({
    data: { title: '05 特殊', description: '', priority: 'high', tags: '', order: 5 },
  })

  // 06 普通（一级）
  await prisma.task.create({
    data: { title: '06 普通', description: '', priority: 'low', tags: '', order: 6 },
  })

  // 07 搭配 + 5个子任务
  const outfitTask = await prisma.task.create({
    data: {
      title: '07 搭配',
      description: '',
      priority: 'low',
      tags: '搭配',
      order: 7,
    },
  })

  await prisma.task.createMany({
    data: [
      { title: '7.1 搭配', description: '', priority: 'low', tags: '搭配', parentId: outfitTask.id, order: 1 },
      { title: '7.2 化妆', description: '', priority: 'low', tags: '化妆', parentId: outfitTask.id, order: 2 },
      { title: '7.3 发型', description: '', priority: 'low', tags: '发型', parentId: outfitTask.id, order: 3 },
      { title: '7.4 护肤和跟练', description: '', priority: 'low', tags: '护肤', parentId: outfitTask.id, order: 4 },
      { title: '7.5 拍照和P图', description: '', priority: 'low', tags: '拍照', parentId: outfitTask.id, order: 5 },
    ],
  })

  // 08 技能 + 4个子任务
  const skillTask = await prisma.task.create({
    data: {
      title: '08 技能',
      description: '',
      priority: 'medium',
      tags: '技能',
      order: 8,
    },
  })

  await prisma.task.createMany({
    data: [
      { title: '8.1 练舞', description: '', priority: 'medium', tags: '舞蹈', parentId: skillTask.id, order: 1 },
      { title: '8.2 滑板', description: '', priority: 'medium', tags: '滑板', parentId: skillTask.id, order: 2 },
      { title: '8.3 游泳', description: '', priority: 'medium', tags: '游泳', parentId: skillTask.id, order: 3 },
      { title: '8.4 vlog', description: '', priority: 'medium', tags: 'vlog', parentId: skillTask.id, order: 4 },
    ],
  })

  // 09 taste + 2个子任务
  const tasteTask = await prisma.task.create({
    data: {
      title: '09 taste',
      description: '',
      priority: 'medium',
      tags: '生活',
      order: 9,
    },
  })

  await prisma.task.createMany({
    data: [
      { title: 'go outside', description: '', priority: 'medium', tags: '', parentId: tasteTask.id, order: 1 },
      { title: 'stay at home', description: '', priority: 'medium', tags: '', parentId: tasteTask.id, order: 2 },
    ],
  })

  console.log('✅ 所有任务已按新结构创建成功！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
