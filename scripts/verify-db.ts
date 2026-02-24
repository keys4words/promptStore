/**
 * Verification script: creates test user, test prompt, and vote.
 * Run: npx tsx scripts/verify-db.ts
 */
import 'dotenv/config'
import { prisma } from '../lib/prisma'
import { Visibility } from '@prisma/client'

async function main() {
  console.log('=== DB Verification Script ===\n')

  // 1. Create or get category
  const category = await prisma.category.upsert({
    where: { name: 'Test' },
    create: { name: 'Test' },
    update: {},
  })
  console.log('Category:', category.name)

  // 2. Create test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
    update: {},
  })
  console.log('User:', user.email, '(id:', user.id, ')')

  // 3. Create test prompt (public)
  const prompt = await prisma.prompt.create({
    data: {
      title: 'Test Prompt',
      content: 'You are a helpful assistant. Always be concise.',
      description: 'Sample verification prompt',
      visibility: Visibility.PUBLIC,
      ownerId: user.id,
      categoryId: category.id,
      publishedAt: new Date(),
    },
  })
  console.log('Prompt:', prompt.title, '(id:', prompt.id, ')')

  // 4. Create or update vote
  const vote = await prisma.vote.upsert({
    where: {
      userId_promptId: { userId: user.id, promptId: prompt.id },
    },
    create: {
      userId: user.id,
      promptId: prompt.id,
      value: 1,
    },
    update: { value: 1 },
  })
  console.log('Vote created (userId, promptId):', vote.userId, vote.promptId)

  console.log('\n=== Verification OK ===')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Verification failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
