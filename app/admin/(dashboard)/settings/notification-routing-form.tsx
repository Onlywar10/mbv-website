"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateNotificationRoutingAction } from "@/lib/actions/settings";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

interface NotificationRoutingFormProps {
	contactEmails: string;
	eventEmails: string;
	membershipDonationEmails: string;
}

export function NotificationRoutingForm({
	contactEmails,
	eventEmails,
	membershipDonationEmails,
}: NotificationRoutingFormProps) {
	const [state, formAction, isPending] = useActionState(
		updateNotificationRoutingAction,
		initialState,
	);

	return (
		<form action={formAction} className="max-w-md space-y-4">
			{state.error && (
				<div className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{state.error}</div>
			)}
			{state.success && (
				<div className="rounded-sm bg-green-500/10 px-3 py-2 text-sm text-green-700">
					{state.success}
				</div>
			)}

			<div className="space-y-2">
				<Label htmlFor="notify_contact" className="font-heading text-xs uppercase tracking-wider">
					Contact Form Submissions
				</Label>
				<Input
					id="notify_contact"
					name="notify_contact"
					defaultValue={contactEmails}
					placeholder="admin@mbv.org, director@mbv.org"
				/>
				<p className="text-xs text-muted-foreground">
					Receives messages submitted via the public contact form.
				</p>
			</div>

			<div className="space-y-2">
				<Label htmlFor="notify_events" className="font-heading text-xs uppercase tracking-wider">
					Event Notifications
				</Label>
				<Input
					id="notify_events"
					name="notify_events"
					defaultValue={eventEmails}
					placeholder="events@mbv.org, admin@mbv.org"
				/>
				<p className="text-xs text-muted-foreground">
					Receives daily registration reports and event-related notifications.
				</p>
			</div>

			<div className="space-y-2">
				<Label
					htmlFor="notify_membership_donation"
					className="font-heading text-xs uppercase tracking-wider"
				>
					Membership & Donation Notifications
				</Label>
				<Input
					id="notify_membership_donation"
					name="notify_membership_donation"
					defaultValue={membershipDonationEmails}
					placeholder="treasurer@mbv.org, admin@mbv.org"
				/>
				<p className="text-xs text-muted-foreground">
					Receives alerts when new memberships or donations are processed.
				</p>
			</div>

			<p className="text-xs text-muted-foreground">
				Separate multiple addresses with commas. If left blank, all active admin users will
				receive notifications.
			</p>

			<Button
				type="submit"
				disabled={isPending}
				className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
			>
				{isPending ? "Saving..." : "Save Notification Routing"}
			</Button>
		</form>
	);
}
