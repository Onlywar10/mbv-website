import type { Metadata } from "next";
import { getTeamMembers } from "@/lib/queries/team";
import { createTeamMemberAction } from "@/lib/actions/team";
import { TeamForm } from "./team-form";
import { TeamGrid } from "./team-grid";

export const metadata: Metadata = {
	title: "Manage Team",
	robots: { index: false, follow: false },
};

export default async function TeamPage() {
	const members = await getTeamMembers();

	return (
		<div>
			<div>
				<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Team</h1>
				<p className="mt-1 text-sm text-muted-foreground">{members.length} members</p>
			</div>

			<div className="mt-6 max-w-xl rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
				<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
					Add Team Member
				</h2>
				<TeamForm action={createTeamMemberAction} />
			</div>

			<div className="mt-8">
				<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
					All Members ({members.length})
				</h2>
				<TeamGrid members={members} />
			</div>
		</div>
	);
}
