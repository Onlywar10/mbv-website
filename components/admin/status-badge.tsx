import { Badge } from "@/components/ui/badge";

const categoryColors: Record<string, string> = {
	fishing: "bg-rust/10 text-rust border-rust/20",
	"whale-watching": "bg-ink/10 text-ink border-ink/20",
	volunteer: "bg-ochre/10 text-ochre border-ochre/20",
	community: "bg-sage/10 text-sage border-sage/20",
	derby: "bg-ink/10 text-ink border-ink/20",
};

const roleColors: Record<string, string> = {
	volunteer: "bg-ochre/10 text-ochre border-ochre/20",
	participant: "bg-rust/10 text-rust border-rust/20",
	member: "bg-ink/10 text-ink border-ink/20",
	donor: "bg-sage/10 text-sage border-sage/20",
};

export function CategoryBadge({ category }: { category: string }) {
	return (
		<Badge variant="outline" className={categoryColors[category] ?? ""}>
			{category.replace("-", " ")}
		</Badge>
	);
}

export function PublishBadge({ isPublished }: { isPublished: boolean }) {
	return (
		<Badge
			variant="outline"
			className={
				isPublished
					? "bg-sage/10 text-sage border-sage/20"
					: "bg-mid-gray/10 text-muted-foreground border-mid-gray/30"
			}
		>
			{isPublished ? "Published" : "Draft"}
		</Badge>
	);
}

export function RoleBadge({ role }: { role: string }) {
	return (
		<Badge variant="outline" className={roleColors[role] ?? ""}>
			{role}
		</Badge>
	);
}
