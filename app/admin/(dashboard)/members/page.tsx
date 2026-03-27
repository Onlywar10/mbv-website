import { Crown, Users } from "lucide-react";
import type { Metadata } from "next";
import { StatCard } from "@/components/admin/stat-card";
import { getAllMemberships } from "@/lib/queries/memberships";
import { AddMemberForm } from "./add-member-form";
import { MembersTable } from "./members-table";

export const metadata: Metadata = {
	title: "Members",
	robots: { index: false, follow: false },
};

export default async function MembersPage() {
	const memberships = await getAllMemberships();

	const active = memberships.filter((m) => m.status === "active");
	const lifetime = active.filter((m) => m.type === "lifetime");

	return (
		<div>
			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Members</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				{memberships.length} total membership{memberships.length !== 1 ? "s" : ""}
			</p>

			<div className="mt-6 grid max-w-lg gap-4 sm:grid-cols-2">
				<StatCard label="Active Members" value={active.length} icon={Users} />
				<StatCard label="Lifetime Members" value={lifetime.length} icon={Crown} />
			</div>

			<div className="mt-8">
				<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
					Add Member
				</h2>
				<div className="rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
					<AddMemberForm />
				</div>
			</div>

			<div className="mt-8">
				<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
					All Members
				</h2>
				<MembersTable memberships={memberships} />
			</div>
		</div>
	);
}
