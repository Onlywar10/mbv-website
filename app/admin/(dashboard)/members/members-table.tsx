"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteMembershipAction, updateMembershipAction } from "@/lib/actions/memberships";
import type { ActionState } from "@/lib/types";

type Membership = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	clientId: string | null;
	type: "annual" | "lifetime";
	status: "active" | "expired" | "cancelled";
	startedAt: Date;
	expiresAt: Date | null;
};

interface MembersTableProps {
	memberships: Membership[];
}

const statusStyles: Record<string, string> = {
	active: "border-sage/20 bg-sage/10 text-sage",
	expired: "border-ochre/20 bg-ochre/10 text-ochre",
	cancelled: "border-muted-foreground/20 bg-muted/10 text-muted-foreground",
};

const typeStyles: Record<string, string> = {
	lifetime: "border-ochre/20 bg-ochre/10 text-ochre",
	annual: "border-rust/20 bg-rust/10 text-rust",
};

function formatDate(date: Date | null) {
	if (!date) return "";
	return new Date(date).toISOString().split("T")[0];
}

const initialState: ActionState = {};

export function MembersTable({ memberships }: MembersTableProps) {
	const [editing, setEditing] = useState<Membership | null>(null);
	const [state, formAction, isPending] = useActionState(
		async (_prev: ActionState, formData: FormData) => {
			const result = await updateMembershipAction(_prev, formData);
			if (result.success) setEditing(null);
			return result;
		},
		initialState,
	);

	return (
		<>
			<div className="overflow-x-auto rounded-sm ring-1 ring-border">
				<table className="w-full text-sm">
					<thead className="bg-cream text-left">
						<tr>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Member
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Email
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Type
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Status
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Since
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Expires
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border bg-cream/50">
						{memberships.length === 0 ? (
							<tr>
								<td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
									No memberships found
								</td>
							</tr>
						) : (
							memberships.map((m) => (
								<tr key={m.id} className="hover:bg-cream">
									<td className="px-4 py-3 font-medium text-primary">
										{m.clientId ? (
											<Link
												href={`/admin/clients/${m.clientId}`}
												className="hover:text-rust hover:underline"
											>
												{m.firstName} {m.lastName}
											</Link>
										) : (
											<span>
												{m.firstName} {m.lastName}
											</span>
										)}
									</td>
									<td className="px-4 py-3 text-muted-foreground">{m.email}</td>
									<td className="px-4 py-3">
										<Badge variant="outline" className={typeStyles[m.type]}>
											{m.type}
										</Badge>
									</td>
									<td className="px-4 py-3">
										<Badge variant="outline" className={statusStyles[m.status]}>
											{m.status}
										</Badge>
									</td>
									<td className="px-4 py-3 text-muted-foreground">
										{new Date(m.startedAt).toLocaleDateString()}
									</td>
									<td className="px-4 py-3 text-muted-foreground">
										{m.expiresAt ? new Date(m.expiresAt).toLocaleDateString() : "Never"}
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center gap-1">
											<Button variant="ghost" size="sm" onClick={() => setEditing(m)}>
												<Pencil className="h-4 w-4" />
											</Button>
											<DeleteDialog
												title={`${m.firstName} ${m.lastName}`}
												onConfirm={async () => {
													await deleteMembershipAction(m.id);
												}}
											/>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<Dialog
				open={editing !== null}
				onOpenChange={(open) => {
					if (!open) setEditing(null);
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							Edit Membership — {editing?.firstName} {editing?.lastName}
						</DialogTitle>
					</DialogHeader>

					<form action={formAction} className="space-y-4">
						<input type="hidden" name="membershipId" value={editing?.id ?? ""} />

						{state.error && (
							<div className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{state.error}</div>
						)}

						<div className="space-y-2">
							<Label className="font-heading text-xs uppercase tracking-wider">Email</Label>
							<Input name="email" type="email" defaultValue={editing?.email} required />
						</div>

						<div className="space-y-2">
							<Label className="font-heading text-xs uppercase tracking-wider">Type</Label>
							<select
								name="type"
								defaultValue={editing?.type}
								className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-sm"
							>
								<option value="annual">Annual</option>
								<option value="lifetime">Lifetime</option>
							</select>
						</div>

						<div className="space-y-2">
							<Label className="font-heading text-xs uppercase tracking-wider">Status</Label>
							<select
								name="status"
								defaultValue={editing?.status}
								className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-sm"
							>
								<option value="active">Active</option>
								<option value="expired">Expired</option>
								<option value="cancelled">Cancelled</option>
							</select>
						</div>

						<div className="space-y-2">
							<Label className="font-heading text-xs uppercase tracking-wider">Expires At</Label>
							<Input
								name="expiresAt"
								type="date"
								defaultValue={formatDate(editing?.expiresAt ?? null)}
							/>
							<p className="text-xs text-muted-foreground">Leave empty for lifetime memberships.</p>
						</div>

						<DialogFooter>
							<Button variant="outline" type="button" onClick={() => setEditing(null)}>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isPending}
								className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
							>
								{isPending ? "Saving..." : "Save Changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
