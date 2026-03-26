"use client";

import { Bell } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { sendExpirationRemindersAction } from "@/lib/actions/email";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

export function SendRemindersButton() {
	const [state, formAction, isPending] = useActionState(
		sendExpirationRemindersAction,
		initialState,
	);

	return (
		<div>
			<form action={formAction}>
				<Button
					type="submit"
					disabled={isPending}
					className="bg-ochre font-heading uppercase text-ink hover:bg-ochre-light"
				>
					<Bell className="mr-2 h-4 w-4" />
					{isPending ? "Sending Reminders..." : "Send Expiration Reminders"}
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
