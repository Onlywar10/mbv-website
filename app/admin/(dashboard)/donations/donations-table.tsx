"use client";

import { DeleteDialog } from "@/components/admin/delete-dialog";
import { PaymentMethodBadge } from "@/components/admin/status-badge";
import { deleteDonationAction } from "@/lib/actions/clients";

type Donation = {
	id: string;
	clientId: string | null;
	firstName: string | null;
	lastName: string | null;
	amount: string;
	paymentMethod: string;
	transactionId: string | null;
	donatedAt: Date;
	notes: string | null;
};

interface DonationsTableProps {
	donations: Donation[];
}

export function DonationsTable({ donations }: DonationsTableProps) {
	return (
		<div className="overflow-x-auto rounded-sm ring-1 ring-border">
			<table className="w-full text-sm">
				<thead className="bg-cream text-left">
					<tr>
						<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
							Client
						</th>
						<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
							Amount
						</th>
						<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
							Method
						</th>
						<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
							Date
						</th>
						<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
							Notes
						</th>
						<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-border bg-cream/50">
					{donations.length === 0 ? (
						<tr>
							<td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
								No donations recorded
							</td>
						</tr>
					) : (
						donations.map((d) => (
							<tr key={d.id} className="hover:bg-cream">
								<td className="px-4 py-3 font-medium text-primary">
									{d.firstName && d.lastName ? `${d.firstName} ${d.lastName}` : "Anonymous"}
								</td>
								<td className="px-4 py-3 font-medium text-primary">${d.amount}</td>
								<td className="px-4 py-3">
									<PaymentMethodBadge method={d.paymentMethod} />
								</td>
								<td className="px-4 py-3 text-muted-foreground">
									{new Date(d.donatedAt).toLocaleDateString()}
								</td>
								<td className="px-4 py-3 text-muted-foreground">{d.notes ?? "—"}</td>
								<td className="px-4 py-3">
									<DeleteDialog
										title="this donation"
										onConfirm={async () => {
											await deleteDonationAction(d.id);
										}}
									/>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
