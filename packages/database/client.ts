import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/client/client";

// Validate DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error(
		"DATABASE_URL environment variable is not set. Please configure it in your .env file."
	);
}

// Create adapter
let adapter: PrismaBetterSqlite3;
try {
	adapter = new PrismaBetterSqlite3({ url: databaseUrl });
} catch (error) {
	console.error("Failed to initialize SQLite adapter:", error);
	throw error;
}

// Global singleton for Prisma Client
declare global {
	// eslint-disable-next-line no-var
	var prismaGlobal: PrismaClient | undefined;
}

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

// Create or reuse Prisma Client
export const prisma: PrismaClient =
	global.prismaGlobal ??
	new PrismaClient({
		adapter,
		log: isDevelopment ? ["query", "error"] : ["error"],
	});

// Store instance in global for reuse (non-production only)
if (isDevelopment) {
	global.prismaGlobal = prisma;
}

// Graceful shutdown handlers
const gracefulShutdown = async () => {
	try {
		await prisma.$disconnect();
		console.log("✅ Database connection closed gracefully");
	} catch (error) {
		console.error("Error disconnecting database:", error);
		process.exit(1);
	}
};

// Handle process termination
process.on("SIGINT", async () => {
	console.log("\n📍 Received SIGINT, closing database...");
	await gracefulShutdown();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("\n📍 Received SIGTERM, closing database...");
	await gracefulShutdown();
	process.exit(0);
});

// Handle uncaught exceptions
process.on("uncaughtException", async (error) => {
	console.error("❌ Uncaught Exception:", error);
	await gracefulShutdown();
	process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", async (reason, promise) => {
	console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
	await gracefulShutdown();
	process.exit(1);
});
