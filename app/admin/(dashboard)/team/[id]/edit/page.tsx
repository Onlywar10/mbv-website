import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateTeamMemberAction } from "@/lib/actions/team";
import { getTeamMemberById } from "@/lib/queries/team";
import { TeamForm } from "../../team-form";

export const metadata: Metadata = {
	title: "Edit Team Member",
	robots: { index: false, follow: false },
};

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function EditTeamMemberPage({ params }: PageProps) {
	const { id } = await params;
	const member = await getTeamMemberById(id);

	if (!member) notFound();

	const boundAction = updateTeamMemberAction.bind(null, id);

	return (
		<div>
			<Link
				href="/admin/team"
				className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
			>
				<ChevronLeft className="h-4 w-4" />
				Back to Team
			</Link>

			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Edit Team Member</h1>
			<p className="mt-1 text-sm text-muted-foreground">{member.name}</p>

			<div className="mt-6 max-w-xl rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
				<TeamForm
					action={boundAction}
					defaultValues={{
						name: member.name,
						title: member.title,
						bio: member.bio,
						imageUrl: member.imageUrl,
						sortOrder: member.sortOrder,
					}}
					submitLabel="Save Changes"
				/>
			</div>
		</div>
	);
}
