"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSmartWaiverSettingsAction } from "@/lib/actions/settings";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

interface SmartWaiverFormProps {
	templateId: string;
}

export function SmartWaiverForm({ templateId }: SmartWaiverFormProps) {
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
				<Label htmlFor="smartwaiver_template_id" className="font-heading text-xs uppercase tracking-wider">
					Waiver Template ID
				</Label>
				<Input
					id="smartwaiver_template_id"
					name="smartwaiver_template_id"
					defaultValue={templateId}
					placeholder="e.g. hnmshblqdfrghyy8be2zav"
				/>
			</div>

			<p className="text-xs text-muted-foreground">
				The template ID is found in your SmartWaiver dashboard URL. Events with &quot;Require
				Waiver&quot; enabled will show the signing widget and track completion. The API key is
				configured via the SMARTWAIVER_API_KEY environment variable.
			</p>

			<Button
				type="submit"
				disabled={isPending}
				className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
			>
				{isPending ? "Saving..." : "Save SmartWaiver Settings"}
			</Button>
		</form>
	);
}
