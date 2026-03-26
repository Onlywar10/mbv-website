"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Membership = {
	id: string;
	clientId: string;
	firstName: string;
	lastName: string;
	email: string;
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

export function MembersTable({ memberships }: MembersTableProps) {
	return (
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
					</tr>
				</thead>
				<tbody className="divide-y divide-border bg-cream/50">
					{memberships.length === 0 ? (
						<tr>
							<td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
								No memberships found
							</td>
						</tr>
					) : (
						memberships.map((m) => (
							<tr key={m.id} className="hover:bg-cream">
								<td className="px-4 py-3 font-medium text-primary">
									<Link
										href={`/admin/clients/${m.clientId}`}
										className="hover:text-rust hover:underline"
									>
										{m.firstName} {m.lastName}
									</Link>
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
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
