import 'dotenv/config'
import { prisma } from '@/lib/prisma'

async function main() {
  console.log('Seeding database...')

  const note1 = await prisma.note.create({
    data: { title: 'Welcome to Next.js + Prisma + NeonDB' },
  })

  const note2 = await prisma.note.create({
    data: { title: 'This is a sample note from the seed script' },
  })

  const note3 = await prisma.note.create({
    data: { title: 'Ready for deployment on Vercel!' },
  })

  console.log('Created notes:', { note1, note2, note3 })
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
