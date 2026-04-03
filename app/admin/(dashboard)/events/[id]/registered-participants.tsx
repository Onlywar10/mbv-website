"use client";

import { DeleteDialog } from "@/components/admin/delete-dialog";
import { RegistrationStatusBadge, WaiverBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { deleteRegistrationAction } from "@/lib/actions/events";

type Registration = {
	id: string;
	clientId: string;
	firstName: string;
	lastName: string;
	email: string;
	role: "participant" | "volunteer";
	status: "registered" | "waitlisted" | "attended" | "cancelled";
	registeredBy: string | null;
	registeredAt: Date;
	notes: string | null;
	waiverSignedAt: Date | null;
	waiverExpiresAt: Date | null;
};

interface RegisteredParticipantsProps {
	registrations: Registration[];
	eventId: string;
}

export function RegisteredParticipants({ registrations, eventId }: RegisteredParticipantsProps) {
	const parents = registrations.filter((r) => !r.registeredBy);
	const guestsByParent = new Map<string, Registration>();
	for (const reg of registrations) {
		if (reg.registeredBy) {
			guestsByParent.set(reg.registeredBy, reg);
		}
	}

	if (parents.length === 0) {
		return <p className="py-4 text-center text-sm text-muted-foreground">No participants</p>;
	}

	return (
		<div className="space-y-3">
			{parents.map((reg) => {
				const guest = guestsByParent.get(reg.id);
				return (
					<div key={reg.id} className="rounded-sm bg-cream p-4 ring-1 ring-border">
						<div className="flex items-center justify-between">
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<p className="font-medium text-primary">
										{reg.firstName} {reg.lastName}
									</p>
									<Badge
										variant="outline"
										className={
											reg.role === "volunteer"
												? "border-ochre/20 bg-ochre/10 text-ochre"
												: "border-rust/20 bg-rust/10 text-rust"
										}
									>
										{reg.role}
									</Badge>
									<RegistrationStatusBadge status={reg.status} />
									<WaiverBadge expiresAt={reg.waiverExpiresAt} signedAt={reg.waiverSignedAt} />
								</div>
								<p className="text-sm text-muted-foreground">{reg.email}</p>
								<p className="mt-1 text-xs text-muted-foreground">
									{new Date(reg.registeredAt).toLocaleDateString()}
								</p>
							</div>
							<DeleteDialog
								title={`${reg.firstName} ${reg.lastName}`}
								onConfirm={async () => {
									await deleteRegistrationAction(reg.id, eventId);
								}}
							/>
						</div>

						{/* Guest nested under parent */}
						{guest && (
							<div className="mt-3 ml-6 rounded-sm border border-border bg-muted/30 p-3">
								<div className="flex items-center gap-2">
									<p className="text-sm font-medium text-primary">
										{guest.firstName} {guest.lastName}
									</p>
									<Badge
										variant="outline"
										className="border-muted-foreground/20 bg-muted/30 text-muted-foreground text-xs"
									>
										guest
									</Badge>
									<RegistrationStatusBadge status={guest.status} />
								</div>
								<p className="text-xs text-muted-foreground">{guest.email}</p>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
