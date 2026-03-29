import { db } from "@/lib/db";
import { appLogs } from "@/lib/db/schema/app-logs";

type LogLevel = "info" | "warn" | "error" | "critical";

interface LogParams {
	level: LogLevel;
	source: string;
	message: string;
	metadata?: Record<string, unknown>;
}

/** Log a message to the app_logs table. Fire-and-forget — never throws. */
export function appLog({ level, source, message, metadata }: LogParams): void {
	db.insert(appLogs)
		.values({
			level,
			source,
			message,
			metadata: metadata ? JSON.stringify(metadata) : null,
		})
		.catch((err) => console.error("Failed to write app log:", err));
}

/** Shorthand loggers */
export const logger = {
	info: (source: string, message: string, metadata?: Record<string, unknown>) =>
		appLog({ level: "info", source, message, metadata }),

	warn: (source: string, message: string, metadata?: Record<string, unknown>) =>
		appLog({ level: "warn", source, message, metadata }),

	error: (source: string, message: string, metadata?: Record<string, unknown>) =>
		appLog({ level: "error", source, message, metadata }),

	critical: (source: string, message: string, metadata?: Record<string, unknown>) =>
		appLog({ level: "critical", source, message, metadata }),
};
