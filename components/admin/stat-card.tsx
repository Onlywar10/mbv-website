import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	label: string;
	value: string | number;
	icon: LucideIcon;
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
	return (
		<div className="rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
			<div className="flex items-center gap-4">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-rust/10">
					<Icon className="h-6 w-6 text-rust" />
				</div>
				<div>
					<p className="text-2xl font-heading font-bold text-primary">{value}</p>
					<p className="text-sm text-muted-foreground">{label}</p>
				</div>
			</div>
		</div>
	);
}
