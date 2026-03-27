"use client";

import { useActionState } from "react";
import { FormField } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createDonationAction } from "@/lib/actions/clients";
import type { ActionState } from "@/lib/types";

type ClientOption = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
};

interface DonationFormProps {
	clients: ClientOption[];
}

const initialState: ActionState = {};

const paymentMethods = [
	{ value: "venmo", label: "Venmo" },
	{ value: "paypal", label: "PayPal" },
	{ value: "check", label: "Check" },
	{ value: "cash", label: "Cash" },
	{ value: "card", label: "Card" },
	{ value: "other", label: "Other" },
];

export function DonationForm({ clients }: DonationFormProps) {
	const [state, formAction, isPending] = useActionState(createDonationAction, initialState);

	return (
		<form action={formAction} className="space-y-4">
			{state.error && (
				<div className="rounded-sm bg-rust/10 px-4 py-2 text-sm text-rust">{state.error}</div>
			)}
			{state.success && (
				<div className="rounded-sm bg-sage/10 px-4 py-2 text-sm text-sage">{state.success}</div>
			)}

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1">
					<Label className="font-heading text-xs uppercase tracking-wider">Client (optional)</Label>
					<select
						name="clientId"
						className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-sm"
					>
						<option value="">Anonymous donation</option>
						{clients.map((c) => (
							<option key={c.id} value={c.id}>
								{c.firstName} {c.lastName} ({c.email})
							</option>
						))}
					</select>
				</div>

				<FormField name="amount" label="Amount ($)" type="number" required placeholder="0.00" />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1">
					<Label className="font-heading text-xs uppercase tracking-wider">
						Payment Method <span className="text-rust">*</span>
					</Label>
					<select
						name="paymentMethod"
						required
						className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-sm"
					>
						{paymentMethods.map((m) => (
							<option key={m.value} value={m.value}>
								{m.label}
							</option>
						))}
					</select>
				</div>

				<FormField name="donatedAt" label="Date" type="date" required />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField name="transactionId" label="Transaction ID" placeholder="Optional reference" />
				<FormField name="notes" label="Notes" placeholder="Optional notes" />
			</div>

			<Button
				type="submit"
				disabled={isPending}
				className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
			>
				{isPending ? "Saving..." : "Log Donation"}
			</Button>
		</form>
	);
}
