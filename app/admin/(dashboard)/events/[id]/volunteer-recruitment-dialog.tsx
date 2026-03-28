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

interface VolunteerRecruitmentDialogProps {
	eventId: string;
	volunteerCount: number;
}

export function VolunteerRecruitmentDialog({
	eventId,
	volunteerCount,
}: VolunteerRecruitmentDialogProps) {
	const [open, setOpen] = useState(false);
	const [state, formAction, isPending] = useActionState<ActionState, FormData>(
		sendVolunteerRecruitmentAction,
		{},
	);

	// Close dialog on success
	if (state.success && open) {
		setOpen(false);
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
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Recruit Volunteers</DialogTitle>
						<DialogDescription>
							Send a recruitment email to past volunteers who aren&apos;t signed up for this event.
							{volunteerCount > 0 && (
								<> This will contact up to <strong>{volunteerCount}</strong> volunteer{volunteerCount !== 1 ? "s" : ""}.</>
							)}
							{volunteerCount === 0 && (
								<> No eligible past volunteers found.</>
							)}
						</DialogDescription>
					</DialogHeader>

					{state.error && (
						<div className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">
							{state.error}
						</div>
					)}

					<form action={formAction} className="space-y-4">
						<input type="hidden" name="eventId" value={eventId} />

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
								disabled={isPending || volunteerCount === 0}
								className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
							>
								{isPending ? "Sending..." : "Send Recruitment Email"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
