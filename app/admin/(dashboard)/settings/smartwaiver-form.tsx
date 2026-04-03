"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSmartWaiverSettingsAction } from "@/lib/actions/settings";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

interface SmartWaiverFormProps {
	waiverUrl: string;
}

export function SmartWaiverForm({ waiverUrl }: SmartWaiverFormProps) {
	const [state, formAction, isPending] = useActionState(
		updateSmartWaiverSettingsAction,
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
				<Label htmlFor="smartwaiver_waiver_url" className="font-heading text-xs uppercase tracking-wider">
					Waiver URL
				</Label>
				<Input
					id="smartwaiver_waiver_url"
					name="smartwaiver_waiver_url"
					defaultValue={waiverUrl}
					placeholder="https://waiver.smartwaiver.com/w/.../web/"
				/>
			</div>

			<p className="text-xs text-muted-foreground">
				The direct link to your SmartWaiver form. This URL is included in approval and reminder
				emails for clients who haven&apos;t signed yet. Update this yearly when the waiver template
				changes.
			</p>

			<Button
				type="submit"
				disabled={isPending}
				className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
			>
				{isPending ? "Saving..." : "Save Waiver URL"}
			</Button>
		</form>
	);
}
