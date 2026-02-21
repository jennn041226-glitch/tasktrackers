import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 删除所有现有任务
  await prisma.taskHistory.deleteMany()
  await prisma.task.deleteMany()

  console.log('✅ 已清空所有任务')

  // 所有任务作为一级任务
  await prisma.task.createMany({
    data: [
      { title: '01 工作① Prompt', description: '', priority: 'high', tags: 'AI,Prompt', order: 1 },
      { title: '01 工作② 课本', description: '科研"划水"指南', priority: 'medium', tags: '学习', order: 2 },
      { title: '01 工作③ 实验', description: '荧光显微镜', priority: 'high', tags: '实验', order: 3 },
      { title: '01 工作④ 生信', description: 'flowjo', priority: 'medium', tags: '生信', order: 4 },
      { title: '02 管理① 人生', description: '', priority: 'medium', tags: '人生', order: 5 },
      { title: '02 管理② 表达管理：逻辑', description: '', priority: 'medium', tags: '表达', order: 6 },
      { title: '02 管理③ 情绪', description: '', priority: 'medium', tags: '情绪', order: 7 },
      { title: '02 管理④ 学习', description: '马斯克工作五步法', priority: 'high', tags: '学习', order: 8 },
      { title: '03 灵魂', description: '', priority: 'low', tags: '', order: 9 },
      { title: '04 读书', description: '', priority: 'medium', tags: '读书', order: 10 },
      { title: '05 特殊', description: '', priority: 'high', tags: '', order: 11 },
      { title: '06 普通', description: '', priority: 'low', tags: '', order: 12 },
      { title: '07搭配-7.1搭配', description: '', priority: 'low', tags: '搭配', order: 13 },
      { title: '07搭配-7.2化妆', description: '', priority: 'low', tags: '化妆', order: 14 },
      { title: '07搭配-7.3发型', description: '', priority: 'low', tags: '发型', order: 15 },
      { title: '07搭配-7.4护肤和跟练', description: '', priority: 'low', tags: '护肤', order: 16 },
      { title: '07搭配-7.5拍照和P图', description: '', priority: 'low', tags: '拍照', order: 17 },
      { title: '08技能-8.1练舞', description: '', priority: 'medium', tags: '舞蹈', order: 18 },
      { title: '08技能-8.2滑板', description: '', priority: 'medium', tags: '滑板', order: 19 },
      { title: '08技能-8.3游泳', description: '', priority: 'medium', tags: '游泳', order: 20 },
      { title: '08技能-8.4vlog', description: '', priority: 'medium', tags: 'vlog', order: 21 },
      { title: '09taste-gooutside', description: '', priority: 'medium', tags: '生活', order: 22 },
      { title: '09taste-stayathome', description: '', priority: 'medium', tags: '生活', order: 23 },
    ],
  })

  console.log('✅ 所有任务已作为一级目录创建成功！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
