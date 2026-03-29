"use client";

import { useState } from "react";

type Log = {
	id: string;
	level: string;
	source: string;
	message: string;
	metadata: string | null;
	createdAt: Date;
};

interface LogsTableProps {
	logs: Log[];
}

const levelColors: Record<string, string> = {
	critical: "bg-red-100 text-red-800",
	error: "bg-rust/10 text-rust",
	warn: "bg-ochre/10 text-ochre",
	info: "bg-ink/10 text-ink",
};

function formatTimestamp(date: Date) {
	return new Date(date).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		second: "2-digit",
	});
}

export function LogsTable({ logs }: LogsTableProps) {
	const [filter, setFilter] = useState("all");
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const filtered = filter === "all" ? logs : logs.filter((l) => l.level === filter);

	return (
		<div>
			<div className="mb-4 flex gap-2">
				{["all", "critical", "error", "warn", "info"].map((f) => (
					<button
						key={f}
						type="button"
						onClick={() => setFilter(f)}
						className={`rounded-sm px-3 py-1.5 font-heading text-sm uppercase tracking-wide transition-colors ${
							filter === f ? "bg-rust/10 text-rust" : "text-muted-foreground hover:bg-muted"
						}`}
					>
						{f}
					</button>
				))}
			</div>

			{filtered.length === 0 ? (
				<p className="py-8 text-center text-sm text-muted-foreground">No logs found</p>
			) : (
				<div className="space-y-1">
					{filtered.map((log) => (
						<div key={log.id}>
							<button
								type="button"
								onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
								className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
							>
								<span
									className={`inline-flex shrink-0 rounded-sm px-2 py-0.5 text-xs font-medium ${levelColors[log.level] ?? ""}`}
								>
									{log.level}
								</span>
								<span className="shrink-0 text-xs text-muted-foreground">
									{formatTimestamp(log.createdAt)}
								</span>
								<span className="shrink-0 font-mono text-xs text-muted-foreground">
									{log.source}
								</span>
								<span className="min-w-0 flex-1 truncate text-primary">
									{log.message}
								</span>
							</button>

							{expandedId === log.id && log.metadata && (
								<div className="ml-6 mb-2 rounded-sm bg-muted/50 p-3">
									<pre className="whitespace-pre-wrap text-xs text-muted-foreground">
										{(() => {
											try {
												return JSON.stringify(JSON.parse(log.metadata), null, 2);
											} catch {
												return log.metadata;
											}
										})()}
									</pre>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
