"use client";

import { Hand } from "lucide-react";
import { useActionState, useState } from "react";
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
import { sendVolunteerRecruitmentAction } from "@/lib/actions/email";
import type { ActionState } from "@/lib/types";

interface Volunteer {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

interface VolunteerRecruitmentDialogProps {
	eventId: string;
	volunteers: Volunteer[];
}

export function VolunteerRecruitmentDialog({
	eventId,
	volunteers,
}: VolunteerRecruitmentDialogProps) {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<Set<string>>(() => new Set(volunteers.map((v) => v.id)));
	const [state, formAction, isPending] = useActionState<ActionState, FormData>(
		sendVolunteerRecruitmentAction,
		{},
	);

	// Close dialog on success
	if (state.success && open) {
		setOpen(false);
	}

	const allSelected = volunteers.length > 0 && selected.size === volunteers.length;

	function toggleAll() {
		if (allSelected) {
			setSelected(new Set());
		} else {
			setSelected(new Set(volunteers.map((v) => v.id)));
		}
	}

	function toggleOne(id: string) {
		const next = new Set(selected);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		setSelected(next);
	}

	return (
		<>
			<Button
				variant="outline"
				onClick={() => setOpen(true)}
				className="inline-flex items-center gap-2 rounded-sm font-heading text-sm uppercase tracking-wider"
			>
				<Hand className="h-4 w-4" />
				Recruit Volunteers
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Recruit Volunteers</DialogTitle>
						<DialogDescription>
							Select which past volunteers to contact for this event.
						</DialogDescription>
					</DialogHeader>

					{state.error && (
						<div className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">
							{state.error}
						</div>
					)}

					<form action={formAction} className="space-y-4">
						<input type="hidden" name="eventId" value={eventId} />
						<input type="hidden" name="clientIds" value={Array.from(selected).join(",")} />

						{/* Volunteer list */}
						{volunteers.length === 0 ? (
							<p className="py-4 text-center text-sm text-muted-foreground">
								No eligible past volunteers found.
							</p>
						) : (
							<div className="space-y-1">
								<div className="flex items-center justify-between pb-2">
									<label className="flex items-center gap-2 text-sm font-medium">
										<input
											type="checkbox"
											checked={allSelected}
											onChange={toggleAll}
											className="h-4 w-4 rounded border-border accent-rust"
										/>
										Select All ({volunteers.length})
									</label>
									<span className="text-xs text-muted-foreground">
										{selected.size} selected
									</span>
								</div>

								<div className="max-h-48 overflow-y-auto rounded-sm border border-border">
									{volunteers.map((v) => (
										<label
											key={v.id}
											className={`flex cursor-pointer items-center gap-3 border-b border-border px-3 py-2 text-sm last:border-b-0 hover:bg-muted/50 ${
												selected.has(v.id) ? "bg-rust/5" : ""
											}`}
										>
											<input
												type="checkbox"
												checked={selected.has(v.id)}
												onChange={() => toggleOne(v.id)}
												className="h-4 w-4 shrink-0 rounded border-border accent-rust"
											/>
											<div className="min-w-0 flex-1">
												<span className="font-medium text-primary">
													{v.firstName} {v.lastName}
												</span>
												<span className="ml-2 text-muted-foreground">{v.email}</span>
											</div>
										</label>
									))}
								</div>
							</div>
						)}

						{/* Personal message */}
						<div className="space-y-2">
							<label
								htmlFor="personalMessage"
								className="font-heading text-xs uppercase tracking-wider"
							>
								Personal Message (optional)
							</label>
							<Textarea
								id="personalMessage"
								name="personalMessage"
								placeholder="Add a personal note to the recruitment email..."
								rows={3}
							/>
							<p className="text-xs text-muted-foreground">
								This message will be included in the email alongside the event details.
							</p>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isPending || selected.size === 0}
								className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
							>
								{isPending ? "Sending..." : `Send to ${selected.size} Volunteer${selected.size !== 1 ? "s" : ""}`}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
