import { PrismaClient } from '@prisma/client'

const database = new PrismaClient()

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: 'Computer Science' },
        { name: 'Music' },
        { name: 'Fitness' },
        { name: 'Photography' },
        { name: 'Accounting' },
        { name: 'Engineering' },
        { name: 'Filming' },
      ],
    })

    // eslint-disable-next-line no-console
    console.log('🟢 Seed script run successfully!🟢')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('🔴 Error in seed script 🔴', error)
  } finally {
    await database.$disconnect()
  }
}

main()
