import { ChevronLeft, Pencil } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
	getClientDonations,
	getClientEventHistory,
	getClientWithRoles,
} from "@/lib/queries/clients";
import { getMembershipByClient } from "@/lib/queries/memberships";
import { MembershipManager } from "./membership-manager";
import { RoleManager } from "./role-manager";

export const metadata: Metadata = {
	title: "Client Detail",
	robots: { index: false, follow: false },
};

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function ClientDetailPage({ params }: PageProps) {
	const { id } = await params;
	const client = await getClientWithRoles(id);

	if (!client) notFound();

	const [eventHistory, donations, membership] = await Promise.all([
		getClientEventHistory(id),
		getClientDonations(id),
		getMembershipByClient(id),
	]);

	return (
		<div>
			<Link
				href="/admin/clients"
				className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
			>
				<ChevronLeft className="h-4 w-4" />
				Back to Clients
			</Link>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">
						{client.firstName} {client.lastName}
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">{client.email}</p>
				</div>
				<Link
					href={`/admin/clients/${id}/edit`}
					className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2 font-heading text-sm uppercase tracking-wider text-cream transition-colors hover:bg-ink-soft"
				>
					<Pencil className="h-4 w-4" />
					Edit
				</Link>
			</div>

			<div className="mt-8 grid gap-6 lg:grid-cols-3">
				{/* Info card */}
				<div className="rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp lg:col-span-2">
					<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
						Information
					</h2>
					<dl className="grid gap-4 sm:grid-cols-2">
						{client.phone && (
							<div>
								<dt className="text-xs text-muted-foreground">Phone</dt>
								<dd className="text-sm text-primary">{client.phone}</dd>
							</div>
						)}
						{client.address && (
							<div>
								<dt className="text-xs text-muted-foreground">Address</dt>
								<dd className="text-sm text-primary">
									{client.address}
									{client.city && `, ${client.city}`}
									{client.state && `, ${client.state}`}
									{client.zip && ` ${client.zip}`}
								</dd>
							</div>
						)}
						<div>
							<dt className="text-xs text-muted-foreground">Status</dt>
							<dd className="text-sm text-primary">{client.isActive ? "Active" : "Inactive"}</dd>
						</div>
						<div>
							<dt className="text-xs text-muted-foreground">Email Opt-in</dt>
							<dd className="text-sm text-primary">{client.emailOptIn ? "Yes" : "No"}</dd>
						</div>
						<div>
							<dt className="text-xs text-muted-foreground">Events Attended</dt>
							<dd className="text-sm text-primary">{client.totalEventsAttended}</dd>
						</div>
						{client.notes && (
							<div className="sm:col-span-2">
								<dt className="text-xs text-muted-foreground">Notes</dt>
								<dd className="text-sm text-primary">{client.notes}</dd>
							</div>
						)}
					</dl>
				</div>

				{/* Roles card */}
				<div className="rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
					<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
						Roles
					</h2>
					<RoleManager clientId={id} currentRoles={client.roles} />
				</div>
			</div>

			{/* Membership */}
			<div className="mt-6 rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
				<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
					Membership
				</h2>
				<MembershipManager clientId={id} membership={membership} />
			</div>

			{/* Event History */}
			<div className="mt-6 rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
				<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
					Event History
				</h2>
				{eventHistory.length === 0 ? (
					<p className="text-sm text-muted-foreground">No event history yet</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left">
									<th className="pb-2 text-xs text-muted-foreground">Event</th>
									<th className="pb-2 text-xs text-muted-foreground">Date</th>
									<th className="pb-2 text-xs text-muted-foreground">Category</th>
									<th className="pb-2 text-xs text-muted-foreground">Guests</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{eventHistory.map((h) => (
									<tr key={h.id}>
										<td className="py-2 text-primary">{h.eventTitle}</td>
										<td className="py-2 text-muted-foreground">{h.eventDate}</td>
										<td className="py-2 text-muted-foreground capitalize">{h.eventCategory}</td>
										<td className="py-2 text-muted-foreground">{h.guestCount}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Donations */}
			<div className="mt-6 rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
				<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
					Donations
				</h2>
				{donations.length === 0 ? (
					<p className="text-sm text-muted-foreground">No donations recorded</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left">
									<th className="pb-2 text-xs text-muted-foreground">Amount</th>
									<th className="pb-2 text-xs text-muted-foreground">Method</th>
									<th className="pb-2 text-xs text-muted-foreground">Date</th>
									<th className="pb-2 text-xs text-muted-foreground">Notes</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{donations.map((d) => (
									<tr key={d.id}>
										<td className="py-2 font-medium text-primary">${d.amount}</td>
										<td className="py-2 capitalize text-muted-foreground">{d.paymentMethod}</td>
										<td className="py-2 text-muted-foreground">
											{new Date(d.donatedAt).toLocaleDateString()}
										</td>
										<td className="py-2 text-muted-foreground">{d.notes ?? "—"}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
