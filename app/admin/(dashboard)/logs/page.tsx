import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentLogs } from "@/lib/queries/logs";
import { LogsTable } from "./logs-table";

export const metadata: Metadata = {
	title: "System Logs",
	robots: { index: false, follow: false },
};

export default async function LogsPage() {
	const logs = await getRecentLogs(200);

	const counts = {
		critical: logs.filter((l) => l.level === "critical").length,
		error: logs.filter((l) => l.level === "error").length,
		warn: logs.filter((l) => l.level === "warn").length,
		info: logs.filter((l) => l.level === "info").length,
	};

	return (
		<div>
			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">System Logs</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Recent application logs and error tracking
			</p>

			<div className="mt-6 grid gap-3 sm:grid-cols-4">
				<Card className="rounded-sm ring-1 ring-border">
					<CardContent className="flex items-center justify-between pt-4">
						<span className="text-sm text-muted-foreground">Critical</span>
						<span className="font-heading text-xl font-bold text-red-600">{counts.critical}</span>
					</CardContent>
				</Card>
				<Card className="rounded-sm ring-1 ring-border">
					<CardContent className="flex items-center justify-between pt-4">
						<span className="text-sm text-muted-foreground">Errors</span>
						<span className="font-heading text-xl font-bold text-rust">{counts.error}</span>
					</CardContent>
				</Card>
				<Card className="rounded-sm ring-1 ring-border">
					<CardContent className="flex items-center justify-between pt-4">
						<span className="text-sm text-muted-foreground">Warnings</span>
						<span className="font-heading text-xl font-bold text-ochre">{counts.warn}</span>
					</CardContent>
				</Card>
				<Card className="rounded-sm ring-1 ring-border">
					<CardContent className="flex items-center justify-between pt-4">
						<span className="text-sm text-muted-foreground">Info</span>
						<span className="font-heading text-xl font-bold text-ink">{counts.info}</span>
					</CardContent>
				</Card>
			</div>

			<Card className="mt-6 rounded-sm ring-1 ring-border shadow-sharp">
				<CardHeader>
					<CardTitle className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
						Recent Logs ({logs.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<LogsTable logs={logs} />
				</CardContent>
			</Card>
		</div>
	);
}
