"use client";

import { DeleteDialog } from "@/components/admin/delete-dialog";
import { RegistrationStatusBadge } from "@/components/admin/status-badge";
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
	guestCount: number;
	registeredAt: Date;
	notes: string | null;
};

interface RegisteredParticipantsProps {
	registrations: Registration[];
	eventId: string;
}

export function RegisteredParticipants({ registrations, eventId }: RegisteredParticipantsProps) {
	if (registrations.length === 0) {
		return <p className="py-4 text-center text-sm text-muted-foreground">No participants</p>;
	}

	return (
		<div className="space-y-3">
			{registrations.map((reg) => (
				<div
					key={reg.id}
					className="flex items-center justify-between rounded-sm bg-cream p-4 ring-1 ring-border"
				>
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
						</div>
						<p className="text-sm text-muted-foreground">{reg.email}</p>
						<div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
							<span>
								{reg.guestCount} guest{reg.guestCount !== 1 ? "s" : ""}
							</span>
							<span>{new Date(reg.registeredAt).toLocaleDateString()}</span>
						</div>
					</div>
					<DeleteDialog
						title={`${reg.firstName} ${reg.lastName}`}
						onConfirm={async () => {
							await deleteRegistrationAction(reg.id, eventId);
						}}
					/>
				</div>
			))}
		</div>
	);
}
