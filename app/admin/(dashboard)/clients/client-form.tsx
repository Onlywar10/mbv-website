"use client";

import { useActionState } from "react";
import { FormField } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/types";

interface ClientFormProps {
	action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
	defaultValues?: {
		firstName?: string;
		lastName?: string;
		email?: string;
		phone?: string;
		address?: string;
		city?: string;
		state?: string;
		zip?: string;
		notes?: string;
		isActive?: boolean;
		emailOptIn?: boolean;
	};
	submitLabel?: string;
}

const initialState: ActionState = {};

export function ClientForm({
	action,
	defaultValues,
	submitLabel = "Create Client",
}: ClientFormProps) {
	const [state, formAction, isPending] = useActionState(action, initialState);

	return (
		<form action={formAction} className="space-y-6">
			{state.error && (
				<div className="rounded-sm bg-rust/10 px-4 py-3 text-sm text-rust">{state.error}</div>
			)}
			{state.success && (
				<div className="rounded-sm bg-sage/10 px-4 py-3 text-sm text-sage">{state.success}</div>
			)}

			<div className="grid gap-6 sm:grid-cols-2">
				<FormField
					name="firstName"
					label="First Name"
					defaultValue={defaultValues?.firstName}
					required
				/>
				<FormField
					name="lastName"
					label="Last Name"
					defaultValue={defaultValues?.lastName}
					required
				/>
			</div>

			<FormField
				name="email"
				label="Email"
				type="email"
				defaultValue={defaultValues?.email}
				required
			/>

			<FormField name="phone" label="Phone" type="tel" defaultValue={defaultValues?.phone} />

			<FormField name="address" label="Address" defaultValue={defaultValues?.address} />

			<div className="grid gap-6 sm:grid-cols-3">
				<FormField name="city" label="City" defaultValue={defaultValues?.city} />
				<FormField name="state" label="State" defaultValue={defaultValues?.state} />
				<FormField name="zip" label="ZIP" defaultValue={defaultValues?.zip} />
			</div>

			<FormField
				name="notes"
				label="Notes"
				defaultValue={defaultValues?.notes}
				textarea
				placeholder="Internal notes about this client"
			/>

			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-3">
					<input
						type="checkbox"
						id="field-isActive"
						name="isActive"
						value="on"
						defaultChecked={defaultValues?.isActive ?? true}
						className="h-4 w-4 rounded-sm border-border"
					/>
					<Label htmlFor="field-isActive" className="font-heading text-xs uppercase tracking-wider">
						Active
					</Label>
				</div>
				<div className="flex items-center gap-3">
					<input
						type="checkbox"
						id="field-emailOptIn"
						name="emailOptIn"
						value="on"
						defaultChecked={defaultValues?.emailOptIn ?? true}
						className="h-4 w-4 rounded-sm border-border"
					/>
					<Label
						htmlFor="field-emailOptIn"
						className="font-heading text-xs uppercase tracking-wider"
					>
						Email opt-in (mailing list)
					</Label>
				</div>
			</div>

			<Button
				type="submit"
				disabled={isPending}
				className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
			>
				{isPending ? "Saving..." : submitLabel}
			</Button>
		</form>
	);
}
