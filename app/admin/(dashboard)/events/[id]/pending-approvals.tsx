"use client";

import { Check, X } from "lucide-react";
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
	guestCount: number;
	registeredAt: Date;
	notes: string | null;
};

interface PendingApprovalsProps {
	registrations: Registration[];
	eventId: string;
}

export function PendingApprovals({ registrations, eventId }: PendingApprovalsProps) {
	if (registrations.length === 0) {
		return <p className="py-4 text-center text-sm text-muted-foreground">No pending signups</p>;
	}

	return (
		<div className="space-y-3">
			{registrations.map((reg) => (
				<div
					key={reg.id}
					className="flex items-center justify-between rounded-sm bg-ochre/5 p-4 ring-1 ring-ochre/20"
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
						</div>
						<p className="text-sm text-muted-foreground">{reg.email}</p>
						<div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
							<span>
								{reg.guestCount} guest{reg.guestCount !== 1 ? "s" : ""}
							</span>
							<span>{new Date(reg.registeredAt).toLocaleDateString()}</span>
						</div>
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
						<form
							action={async () => {
								await deleteRegistrationAction(reg.id, eventId);
							}}
						>
							<Button
								type="submit"
								size="sm"
								variant="outline"
								className="gap-1 border-rust/30 font-heading text-xs uppercase text-rust hover:bg-rust/5"
							>
								<X className="h-3.5 w-3.5" />
								Deny
							</Button>
						</form>
					</div>
				</div>
			))}
		</div>
	);
}
