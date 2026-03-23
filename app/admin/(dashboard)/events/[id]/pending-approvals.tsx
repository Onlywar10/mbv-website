"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
};

interface PendingApprovalsProps {
	registrations: Registration[];
	eventId: string;
}

export function PendingApprovals({ registrations, eventId }: PendingApprovalsProps) {
	const [denyTarget, setDenyTarget] = useState<Registration | null>(null);
	const [reason, setReason] = useState("");
	const [pending, setPending] = useState(false);

	const parents = registrations.filter((r) => !r.registeredBy);
	const guestsByParent = new Map<string, Registration>();
	for (const reg of registrations) {
		if (reg.registeredBy) {
			guestsByParent.set(reg.registeredBy, reg);
		}
	}

	const handleDeny = async () => {
		if (!denyTarget) return;
		setPending(true);
		await deleteRegistrationAction(denyTarget.id, eventId, reason || undefined);
		setPending(false);
		setDenyTarget(null);
		setReason("");
	};

	if (parents.length === 0) {
		return <p className="py-4 text-center text-sm text-muted-foreground">No pending signups</p>;
	}

	return (
		<>
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
									<Button
										size="sm"
										variant="outline"
										className="gap-1 border-rust/30 font-heading text-xs uppercase text-rust hover:bg-rust/5"
										onClick={() => setDenyTarget(reg)}
									>
										<X className="h-3.5 w-3.5" />
										Deny
									</Button>
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

			<Dialog
				open={denyTarget !== null}
				onOpenChange={(open) => {
					if (!open) {
						setDenyTarget(null);
						setReason("");
					}
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Deny Registration</DialogTitle>
						<DialogDescription>
							{denyTarget?.firstName} {denyTarget?.lastName} ({denyTarget?.role}) will be notified
							by email that their registration was not approved.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-2">
						<label htmlFor="deny-reason" className="font-heading text-xs uppercase tracking-wider">
							Reason (optional)
						</label>
						<Textarea
							id="deny-reason"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder="e.g. Event is at full capacity, age requirement not met..."
							rows={3}
						/>
						<p className="text-xs text-muted-foreground">
							If provided, this will be included in the denial email.
						</p>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setDenyTarget(null);
								setReason("");
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={handleDeny}
							disabled={pending}
							className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
						>
							{pending ? "Denying..." : "Deny Registration"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
