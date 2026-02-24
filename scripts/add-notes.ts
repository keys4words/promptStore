/**
 * Creates several test notes.
 * Run: npx tsx scripts/add-notes.ts
 */
import 'dotenv/config'
import { prisma } from '../lib/prisma'

const TEST_NOTES = [
  'Первая тестовая заметка',
  'Промт для копирайтинга: напиши продающий текст',
  'Системный промт для ChatGPT: ты опытный программист',
  'Идея для статьи: преимущества ORM',
  'Заметка о миграциях базы данных',
  'Список задач на неделю',
]

async function main() {
  console.log('Adding test notes...')

  const user = await prisma.user.upsert({
    where: { email: 'notes@example.com' },
    create: {
      email: 'notes@example.com',
      name: 'Notes User',
    },
    update: {},
  })

  for (const title of TEST_NOTES) {
    await prisma.note.create({
      data: { title, ownerId: user.id },
    })
    console.log('  +', title)
  }

  console.log(`Created ${TEST_NOTES.length} notes.`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
