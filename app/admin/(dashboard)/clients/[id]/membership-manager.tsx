"use client";

import { Crown, RefreshCw, XCircle } from "lucide-react";
import { useActionState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	assignMembershipAction,
	renewMembershipAction,
	revokeMembershipAction,
} from "@/lib/actions/memberships";
import type { ActionState } from "@/lib/types";

type Membership = {
	id: string;
	type: "annual" | "lifetime";
	status: "active" | "expired" | "cancelled";
	startedAt: Date;
	expiresAt: Date | null;
} | null;

interface MembershipManagerProps {
	clientId: string;
	membership: Membership;
}

const initialState: ActionState = {};

export function MembershipManager({ clientId, membership }: MembershipManagerProps) {
	const [assignState, assignAction, assignPending] = useActionState(
		async (_prev: ActionState, formData: FormData) => {
			const type = formData.get("type") as "annual" | "lifetime";
			return assignMembershipAction(clientId, type);
		},
		initialState,
	);

	const [revokeState, revokeAction, revokePending] = useActionState(async () => {
		if (!membership) return { error: "No membership to revoke." };
		return revokeMembershipAction(membership.id, clientId);
	}, initialState);

	const [renewState, renewAction, renewPending] = useActionState(async () => {
		if (!membership) return { error: "No membership to renew." };
		return renewMembershipAction(membership.id, clientId);
	}, initialState);

	const state =
		assignState.error || assignState.success
			? assignState
			: revokeState.error || revokeState.success
				? revokeState
				: renewState;

	if (!membership || membership.status !== "active") {
		return (
			<div>
				{state.error && (
					<div className="mb-3 rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">
						{state.error}
					</div>
				)}
				{state.success && (
					<div className="mb-3 rounded-sm bg-green-500/10 px-3 py-2 text-sm text-green-700">
						{state.success}
					</div>
				)}

				{membership && (
					<div className="mb-4">
						<Badge
							variant="outline"
							className={
								membership.status === "expired"
									? "border-ochre/20 bg-ochre/10 text-ochre"
									: "border-muted-foreground/20 bg-muted/10 text-muted-foreground"
							}
						>
							{membership.type} — {membership.status}
						</Badge>
					</div>
				)}

				<p className="mb-3 text-sm text-muted-foreground">
					{membership ? "Membership is no longer active." : "No membership on record."}
				</p>
				<div className="flex gap-2">
					<form action={assignAction}>
						<input type="hidden" name="type" value="annual" />
						<Button
							type="submit"
							size="sm"
							disabled={assignPending}
							className="bg-rust font-heading text-xs uppercase text-cream hover:bg-rust-light"
						>
							{assignPending ? "..." : "Assign Annual"}
						</Button>
					</form>
					<form action={assignAction}>
						<input type="hidden" name="type" value="lifetime" />
						<Button
							type="submit"
							size="sm"
							disabled={assignPending}
							className="bg-ochre font-heading text-xs uppercase text-ink hover:bg-ochre-light"
						>
							{assignPending ? "..." : "Assign Lifetime"}
						</Button>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div>
			{state.error && (
				<div className="mb-3 rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{state.error}</div>
			)}
			{state.success && (
				<div className="mb-3 rounded-sm bg-green-500/10 px-3 py-2 text-sm text-green-700">
					{state.success}
				</div>
			)}

			<div className="mb-3 flex items-center gap-2">
				<Crown className="h-4 w-4 text-ochre" />
				<Badge variant="outline" className="border-ochre/20 bg-ochre/10 text-ochre">
					{membership.type === "lifetime" ? "Lifetime Member" : "Annual Member"}
				</Badge>
			</div>

			<dl className="space-y-2 text-sm">
				<div>
					<dt className="text-xs text-muted-foreground">Member Since</dt>
					<dd className="text-primary">{new Date(membership.startedAt).toLocaleDateString()}</dd>
				</div>
				{membership.expiresAt && (
					<div>
						<dt className="text-xs text-muted-foreground">Expires</dt>
						<dd className="text-primary">{new Date(membership.expiresAt).toLocaleDateString()}</dd>
					</div>
				)}
			</dl>

			<div className="mt-4 flex gap-2">
				{membership.type === "annual" && (
					<form action={renewAction}>
						<Button
							type="submit"
							size="sm"
							disabled={renewPending}
							className="gap-1 bg-sage font-heading text-xs uppercase text-cream hover:bg-sage/90"
						>
							<RefreshCw className="h-3 w-3" />
							{renewPending ? "..." : "Renew"}
						</Button>
					</form>
				)}
				<form action={revokeAction}>
					<Button
						type="submit"
						size="sm"
						variant="outline"
						disabled={revokePending}
						className="gap-1 border-rust/30 font-heading text-xs uppercase text-rust hover:bg-rust/5"
					>
						<XCircle className="h-3 w-3" />
						{revokePending ? "..." : "Revoke"}
					</Button>
				</form>
			</div>
		</div>
	);
}
