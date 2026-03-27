"use client";

import { Mail } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { sendRegistrationReportAction } from "@/lib/actions/email";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

export function SendReportButton() {
	const [state, formAction, isPending] = useActionState(sendRegistrationReportAction, initialState);

	return (
		<div>
			<form action={formAction}>
				<Button
					type="submit"
					disabled={isPending}
					className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
				>
					<Mail className="mr-2 h-4 w-4" />
					{isPending ? "Sending Report..." : "Send Yesterday's Report"}
				</Button>
			</form>
			{state.error && (
				<div className="mt-3 rounded-sm bg-rust/10 px-4 py-2 text-sm text-rust">{state.error}</div>
			)}
			{state.success && (
				<div className="mt-3 rounded-sm bg-green-500/10 px-4 py-2 text-sm text-green-700">
					{state.success}
				</div>
			)}
		</div>
	);
}
