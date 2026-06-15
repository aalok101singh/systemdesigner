import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return url;
};

const createPrismaClient = () => {
  const databaseUrl = getDatabaseUrl();

  if (databaseUrl.startsWith("prisma+postgres://")) {
    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  return new PrismaClient({ adapter });
};

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const client = createPrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
    return client;
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
