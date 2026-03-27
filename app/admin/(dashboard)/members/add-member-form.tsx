"use client";

import { useActionState } from "react";
import { FormField } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createMembershipAction } from "@/lib/actions/memberships";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

export function AddMemberForm() {
	const [state, formAction, isPending] = useActionState(createMembershipAction, initialState);

	return (
		<form action={formAction} className="space-y-4">
			{state.error && (
				<div className="rounded-sm bg-rust/10 px-4 py-2 text-sm text-rust">{state.error}</div>
			)}
			{state.success && (
				<div className="rounded-sm bg-sage/10 px-4 py-2 text-sm text-sage">{state.success}</div>
			)}

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField name="firstName" label="First Name" required placeholder="First name" />
				<FormField name="lastName" label="Last Name" required placeholder="Last name" />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					name="email"
					label="Email"
					type="email"
					required
					placeholder="email@example.com"
				/>
				<div className="space-y-1">
					<Label className="font-heading text-xs uppercase tracking-wider">
						Membership Type <span className="text-rust">*</span>
					</Label>
					<select
						name="type"
						required
						className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-sm"
					>
						<option value="annual">Annual ($40/year)</option>
						<option value="lifetime">Lifetime ($385)</option>
					</select>
				</div>
			</div>

			<Button
				type="submit"
				disabled={isPending}
				className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
			>
				{isPending ? "Adding..." : "Add Member"}
			</Button>
		</form>
	);
}
