"use client";

import { Check, X } from "lucide-react";
import { ReasonDialog } from "@/components/admin/reason-dialog";
import { WaiverBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteRegistrationAction, updateRegistrationStatusAction } from "@/lib/actions/events";

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

interface PendingApprovalsProps {
	registrations: Registration[];
	eventId: string;
}

export function PendingApprovals({ registrations, eventId }: PendingApprovalsProps) {
	const parents = registrations.filter((r) => !r.registeredBy);
	const guestsByParent = new Map<string, Registration>();
	for (const reg of registrations) {
		if (reg.registeredBy) {
			guestsByParent.set(reg.registeredBy, reg);
		}
	}

	if (parents.length === 0) {
		return <p className="py-4 text-center text-sm text-muted-foreground">No pending signups</p>;
	}

	return (
		<div className="space-y-3">
			{parents.map((reg) => {
				const guest = guestsByParent.get(reg.id);
				return (
					<div key={reg.id} className="rounded-sm bg-ochre/5 p-4 ring-1 ring-ochre/20">
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
									<WaiverBadge expiresAt={reg.waiverExpiresAt} signedAt={reg.waiverSignedAt} />
								</div>
								<p className="text-sm text-muted-foreground">{reg.email}</p>
								<p className="mt-1 text-xs text-muted-foreground">
									{new Date(reg.registeredAt).toLocaleDateString()}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<form
									action={async () => {
										await updateRegistrationStatusAction(reg.id, eventId, "registered");
									}}
								>
									<Button
										type="submit"
										size="sm"
										className="gap-1 bg-sage font-heading text-xs uppercase text-cream hover:bg-sage/90"
									>
										<Check className="h-3.5 w-3.5" />
										Approve
									</Button>
								</form>
								<ReasonDialog
									title="Deny Registration"
									description={`${reg.firstName} ${reg.lastName} (${reg.role}) will be notified by email that their registration was not approved.`}
									confirmLabel="Deny Registration"
									pendingLabel="Denying..."
									placeholder="e.g. Event is at full capacity, age requirement not met..."
									trigger={
										<Button
											size="sm"
											variant="outline"
											className="gap-1 border-rust/30 font-heading text-xs uppercase text-rust hover:bg-rust/5"
										>
											<X className="h-3.5 w-3.5" />
											Deny
										</Button>
									}
									onConfirm={async (reason) => {
										await deleteRegistrationAction(reg.id, eventId, reason);
									}}
								/>
							</div>
						</div>

						{/* Guest nested under parent */}
						{guest && (
							<div className="mt-3 ml-6 rounded-sm border border-border bg-cream/50 p-3">
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
