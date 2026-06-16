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
    // Prisma client types don't expose the runtime-only `datasources` option
    // in the generated `PrismaClientOptions` type. Cast to `any` to allow
    // providing the runtime override for the datasource URL used by
    // `prisma+postgres://` (Accelerate) without changing generated types.
    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    } as any);
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  // The `adapter` option is also a runtime extension not reflected in the
  // generated types; cast to `any` to pass it through.
  return new PrismaClient({ adapter } as any);
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
