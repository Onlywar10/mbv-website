"use client";

import { useActionState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSmartWaiverSettingsAction } from "@/lib/actions/settings";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

interface SmartWaiverFormProps {
	volunteeringUrl: string;
	boatingUrl: string;
	webhookBaseUrl: string;
}

export function SmartWaiverForm({
	volunteeringUrl,
	boatingUrl,
	webhookBaseUrl,
}: SmartWaiverFormProps) {
	const [state, formAction, isPending] = useActionState(
		updateSmartWaiverSettingsAction,
		initialState,
	);
	const formKey = useId() + (state.success ? "-saved" : "");

	const volunteeringWebhook = `${webhookBaseUrl}/api/webhooks/smartwaiver/volunteering`;
	const boatingWebhook = `${webhookBaseUrl}/api/webhooks/smartwaiver/boating`;

	return (
		<div className="max-w-md space-y-6">
			<form key={formKey} action={formAction} className="space-y-4">
				{state.error && (
					<div className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{state.error}</div>
				)}
				{state.success && (
					<div className="rounded-sm bg-green-500/10 px-3 py-2 text-sm text-green-700">
						{state.success}
					</div>
				)}

				<div className="space-y-2">
					<Label
						htmlFor="smartwaiver_volunteering_url"
						className="font-heading text-xs uppercase tracking-wider"
					>
						Volunteering Waiver URL
					</Label>
					<Input
						id="smartwaiver_volunteering_url"
						name="smartwaiver_volunteering_url"
						defaultValue={volunteeringUrl}
						placeholder="https://waiver.smartwaiver.com/w/.../web/"
					/>
				</div>

				<div className="space-y-2">
					<Label
						htmlFor="smartwaiver_boating_url"
						className="font-heading text-xs uppercase tracking-wider"
					>
						Boating Waiver URL
					</Label>
					<Input
						id="smartwaiver_boating_url"
						name="smartwaiver_boating_url"
						defaultValue={boatingUrl}
						placeholder="https://waiver.smartwaiver.com/w/.../web/"
					/>
				</div>

				<p className="text-xs text-muted-foreground">
					Direct links to your SmartWaiver forms. These URLs are included in approval and reminder
					emails for events that require the corresponding waiver.
				</p>

				<Button
					type="submit"
					disabled={isPending}
					className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
				>
					{isPending ? "Saving..." : "Save Waiver URLs"}
				</Button>
			</form>

			{/* Webhook URLs for SmartWaiver configuration */}
			<div className="rounded-sm border border-border bg-muted/30 p-4 space-y-3">
				<p className="font-heading text-xs uppercase tracking-wider text-muted-foreground">
					Webhook Endpoints
				</p>
				<p className="text-xs text-muted-foreground">
					Paste these URLs into each SmartWaiver template&apos;s webhook settings. Enable &quot;Web
					Endpoint&quot; and set email validation to &quot;after validated.&quot;
				</p>
				<div className="space-y-2">
					<div>
						<p className="text-xs font-medium text-muted-foreground">Volunteering Waiver</p>
						<code className="block mt-1 rounded-sm bg-background px-2 py-1.5 text-xs break-all ring-1 ring-border">
							{volunteeringWebhook}
						</code>
					</div>
					<div>
						<p className="text-xs font-medium text-muted-foreground">Boating Waiver</p>
						<code className="block mt-1 rounded-sm bg-background px-2 py-1.5 text-xs break-all ring-1 ring-border">
							{boatingWebhook}
						</code>
					</div>
				</div>
			</div>
		</div>
	);
}
