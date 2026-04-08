"use client";

import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { deleteTeamMemberAction } from "@/lib/actions/team";

type TeamMember = {
	id: string;
	name: string;
	title: string;
	bio: string;
	imageUrl: string;
	sortOrder: number;
};

interface TeamGridProps {
	members: TeamMember[];
}

export function TeamGrid({ members }: TeamGridProps) {
	if (members.length === 0) {
		return (
			<p className="py-12 text-center text-muted-foreground">No team members yet. Add one above.</p>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{members.map((member) => (
				<div key={member.id} className="overflow-hidden rounded-sm ring-1 ring-border">
					<div className="relative aspect-square">
						<Image
							src={member.imageUrl}
							alt={member.name}
							fill
							className="object-cover"
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
						/>
					</div>
					<div className="bg-cream px-4 py-3">
						<p className="font-heading text-sm font-bold text-primary">{member.name}</p>
						<p className="text-xs text-rust">{member.title}</p>
						<p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{member.bio}</p>
						<div className="mt-2 flex items-center justify-between">
							<span className="text-xs text-muted-foreground/60">Order: {member.sortOrder}</span>
							<div className="flex items-center gap-1">
								<Link
									href={`/admin/team/${member.id}/edit`}
									className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground hover:text-primary"
								>
									<Pencil className="h-4 w-4" />
								</Link>
								<DeleteDialog
									title={member.name}
									onConfirm={async () => {
										await deleteTeamMemberAction(member.id);
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
