import { Badge } from "@/components/ui/badge";

const categoryColors: Record<string, string> = {
	fishing: "bg-rust text-cream border-rust",
	"whale-watching": "bg-ink text-cream border-ink",
	volunteer: "bg-ochre text-ink border-ochre",
	community: "bg-sage text-cream border-sage",
	derby: "bg-ink text-cream border-ink",
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
				isPublished ? "bg-sage text-cream border-sage" : "bg-mid-gray text-cream border-mid-gray"
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

const registrationStatusColors: Record<string, string> = {
	registered: "bg-sage/10 text-sage border-sage/20",
	waitlisted: "bg-ochre/10 text-ochre border-ochre/20",
	attended: "bg-ink/10 text-ink border-ink/20",
	cancelled: "bg-rust/10 text-rust border-rust/20",
};

export function RegistrationStatusBadge({ status }: { status: string }) {
	return (
		<Badge variant="outline" className={registrationStatusColors[status] ?? ""}>
			{status}
		</Badge>
	);
}

export function WaiverBadge({
	signedAt,
	expiresAt,
}: {
	signedAt: Date | null;
	expiresAt: Date | null;
}) {
	if (signedAt && expiresAt && new Date(expiresAt) > new Date()) {
		return (
			<Badge variant="outline" className="bg-sage/10 text-sage border-sage/20">
				waiver signed
			</Badge>
		);
	}
	if (signedAt && expiresAt && new Date(expiresAt) <= new Date()) {
		return (
			<Badge variant="outline" className="bg-rust/10 text-rust border-rust/20">
				waiver expired
			</Badge>
		);
	}
	return (
		<Badge variant="outline" className="bg-ochre/10 text-ochre border-ochre/20">
			waiver pending
		</Badge>
	);
}

export function PaymentMethodBadge({ method }: { method: string }) {
	return (
		<Badge variant="outline" className="bg-ink/5 text-muted-foreground border-ink/10">
			{method}
		</Badge>
	);
}
