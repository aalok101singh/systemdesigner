import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, type PoolConfig } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return url;
}

function isPrismaPostgresServerlessUrl(databaseUrl: string) {
  try {
    const hostname = new URL(databaseUrl).hostname;
    return hostname === "db.prisma.io";
  } catch {
    return false;
  }
}

function isRetryableConnectionError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const prismaError = error as {
    code?: string;
    message?: string;
    meta?: { driverAdapterError?: { name?: string; cause?: { message?: string } } };
    cause?: { message?: string };
  };

  const messages = [
    prismaError.message,
    prismaError.cause?.message,
    prismaError.meta?.driverAdapterError?.name,
    prismaError.meta?.driverAdapterError?.cause?.message,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    prismaError.code === "P1017" ||
    prismaError.meta?.driverAdapterError?.name === "ConnectionClosed" ||
    messages.includes("Server has closed the connection") ||
    messages.includes("Connection terminated due to connection timeout") ||
    messages.includes("Connection terminated unexpectedly") ||
    messages.includes("Can't reach database server")
  );
}

function getPoolConfig(connectionString: string): PoolConfig {
  return {
    connectionString,
    max: 10,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
    keepAlive: true,
  };
}

function createPgPool(connectionString: string) {
  const pool = new Pool(getPoolConfig(connectionString));

  pool.on("error", (error) => {
    console.error("[prisma] PostgreSQL pool error:", error.message);
  });

  return pool;
}

async function resetDatabaseClient() {
  if (globalForPrisma.pgPool) {
    await globalForPrisma.pgPool.end().catch(() => undefined);
    globalForPrisma.pgPool = undefined;
  }

  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect().catch(() => undefined);
    globalForPrisma.prisma = undefined;
  }
}

let reconnectPromise: Promise<PrismaClient> | null = null;

async function refreshPrismaClient(): Promise<PrismaClient> {
  if (!reconnectPromise) {
    reconnectPromise = (async () => {
      await resetDatabaseClient();
      return initializePrismaClient();
    })().finally(() => {
      reconnectPromise = null;
    });
  }

  return reconnectPromise;
}

function getOrCreatePool(connectionString: string) {
  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = createPgPool(connectionString);
  }

  return globalForPrisma.pgPool;
}

function createAccelerateClient(databaseUrl: string) {
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  } as any);
}

function createServerlessClient(databaseUrl: string) {
  const adapter = new PrismaPostgresAdapter({
    connectionString: databaseUrl,
  });

  return new PrismaClient({ adapter } as any);
}

function createDriverAdapterClient(databaseUrl: string) {
  const pool = getOrCreatePool(databaseUrl);
  const adapter = new PrismaPg(pool, {
    onPoolError: (error) => {
      console.error("[prisma] Adapter pool error:", error.message);
    },
  });

  return new PrismaClient({ adapter } as any);
}

function createBasePrismaClient() {
  const databaseUrl = getDatabaseUrl();

  if (databaseUrl.startsWith("prisma+postgres://")) {
    return createAccelerateClient(databaseUrl);
  }

  if (isPrismaPostgresServerlessUrl(databaseUrl)) {
    return createServerlessClient(databaseUrl);
  }

  return createDriverAdapterClient(databaseUrl);
}

function rerunOperation(
  client: PrismaClient,
  model: string | undefined,
  operation: string,
  args: unknown
) {
  if (!model) {
    return (client as any)[operation](args);
  }

  const modelKey = model.charAt(0).toLowerCase() + model.slice(1);
  return (client as any)[modelKey][operation](args);
}

const RETRYABLE_READ_OPERATIONS = new Set([
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
]);

function createPrismaClientWithRetry(): PrismaClient {
  const baseClient = createBasePrismaClient();
  const databaseUrl = getDatabaseUrl();
  const usesServerlessDriver = isPrismaPostgresServerlessUrl(databaseUrl);

  if (usesServerlessDriver || databaseUrl.startsWith("prisma+postgres://")) {
    return baseClient;
  }

  const extendedClient = baseClient.$extends({
    query: {
      $allOperations({ model, operation, args, query }) {
        return query(args).catch(async (error: unknown) => {
          if (!isRetryableConnectionError(error)) {
            throw error;
          }

          if (!RETRYABLE_READ_OPERATIONS.has(operation)) {
            throw error;
          }

          const freshClient = await refreshPrismaClient();
          return rerunOperation(freshClient, model, operation, args);
        });
      },
    },
  });

  return extendedClient as PrismaClient;
}

function initializePrismaClient(): PrismaClient {
  const client = createPrismaClientWithRetry();
  globalForPrisma.prisma = client;
  return client;
}

export const prisma = globalForPrisma.prisma ?? initializePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
