"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCampaignCodesAction } from "@/lib/actions/settings";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

interface CampaignCodesFormProps {
	annualCode: string;
	lifetimeCode: string;
}

export function CampaignCodesForm({ annualCode, lifetimeCode }: CampaignCodesFormProps) {
	const [state, formAction, isPending] = useActionState(updateCampaignCodesAction, initialState);

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
				<Label htmlFor="annual" className="font-heading text-xs uppercase tracking-wider">
					Annual Membership Campaign Code
				</Label>
				<Input
					id="annual"
					name="annual"
					defaultValue={annualCode}
					placeholder="e.g. mbv-annual-membership"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="lifetime" className="font-heading text-xs uppercase tracking-wider">
					Lifetime Membership Campaign Code
				</Label>
				<Input
					id="lifetime"
					name="lifetime"
					defaultValue={lifetimeCode}
					placeholder="e.g. mbv-lifetime-membership"
				/>
			</div>

			<p className="text-xs text-muted-foreground">
				These codes must match the campaign codes in your GiveButter dashboard. Only transactions
				from these campaigns will create memberships.
			</p>

			<Button
				type="submit"
				disabled={isPending}
				className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
			>
				{isPending ? "Saving..." : "Save Campaign Codes"}
			</Button>
		</form>
	);
}
