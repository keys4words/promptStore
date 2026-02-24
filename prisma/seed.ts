import 'dotenv/config'
import { prisma } from '../lib/prisma'
import { Visibility } from '@prisma/client'

async function main() {
  console.log('Seeding database...')

  const user = await prisma.user.upsert({
    where: { email: 'seed@example.com' },
    create: {
      email: 'seed@example.com',
      name: 'Seed User',
    },
    update: {},
  })

  const category = await prisma.category.upsert({
    where: { name: 'General' },
    create: { name: 'General' },
    update: {},
  })

  await prisma.note.createMany({
    data: [
      { title: 'Welcome to Next.js + Prisma + NeonDB', ownerId: user.id },
      { title: 'This is a sample note from the seed script', ownerId: user.id },
      { title: 'Ready for deployment on Vercel!', ownerId: user.id },
    ],
  })

  const prompt = await prisma.prompt.create({
    data: {
      title: 'Sample Prompt',
      content: 'You are a helpful AI assistant.',
      description: 'Seed prompt',
      visibility: Visibility.PUBLIC,
      ownerId: user.id,
      categoryId: category.id,
      publishedAt: new Date(),
    },
  })

  await prisma.vote.create({
    data: {
      userId: user.id,
      promptId: prompt.id,
      value: 1,
    },
  })

  console.log('Seed completed!')
}

main()
  .then(() => {
    console.log('Seed script finished successfully')
    process.exit(0)
  })
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
