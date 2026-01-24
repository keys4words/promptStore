import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample notes
  const note1 = await prisma.note.create({
    data: {
      title: 'Welcome to Next.js + Prisma + NeonDB',
    },
  })

  const note2 = await prisma.note.create({
    data: {
      title: 'This is a sample note from the seed script',
    },
  })

  const note3 = await prisma.note.create({
    data: {
      title: 'Ready for deployment on Vercel!',
    },
  })

  console.log('Created notes:', { note1, note2, note3 })
  console.log('Seed completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

