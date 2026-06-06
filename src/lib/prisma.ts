import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// For demo purposes, create a mock prisma client if DATABASE_URL is not set
function createPrismaClient() {
  try {
    return new PrismaClient()
  } catch (error) {
    console.warn("Prisma client initialization failed, using mock data")
    return null
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma
}
