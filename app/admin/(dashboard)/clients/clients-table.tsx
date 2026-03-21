"use client";

import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Client = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	isActive: boolean;
	totalEventsAttended: number;
	createdAt: Date;
};

interface ClientsTableProps {
	clients: Client[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
	const [search, setSearch] = useState("");

	const filtered = search
		? clients.filter(
				(c) =>
					c.firstName.toLowerCase().includes(search.toLowerCase()) ||
					c.lastName.toLowerCase().includes(search.toLowerCase()) ||
					c.email.toLowerCase().includes(search.toLowerCase()),
			)
		: clients;

	return (
		<div>
			<div className="mb-4">
				<input
					type="text"
					placeholder="Search clients..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full max-w-sm rounded-sm border border-input bg-background px-3 py-2 text-sm"
				/>
			</div>

			<div className="overflow-x-auto rounded-sm ring-1 ring-border">
				<table className="w-full text-sm">
					<thead className="bg-cream text-left">
						<tr>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Name
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Email
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Events
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Status
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border bg-cream/50">
						{filtered.length === 0 ? (
							<tr>
								<td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
									No clients found
								</td>
							</tr>
						) : (
							filtered.map((client) => (
								<tr key={client.id} className="hover:bg-cream">
									<td className="px-4 py-3 font-medium text-primary">
										{client.firstName} {client.lastName}
									</td>
									<td className="px-4 py-3 text-muted-foreground">{client.email}</td>
									<td className="px-4 py-3 text-muted-foreground">{client.totalEventsAttended}</td>
									<td className="px-4 py-3">
										<span
											className={`inline-flex rounded-sm px-2 py-0.5 text-xs font-medium ${
												client.isActive
													? "bg-sage/10 text-sage"
													: "bg-mid-gray/10 text-muted-foreground"
											}`}
										>
											{client.isActive ? "Active" : "Inactive"}
										</span>
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center gap-1">
											<Link href={`/admin/clients/${client.id}`}>
												<Button variant="ghost" size="sm">
													<Eye className="h-4 w-4" />
												</Button>
											</Link>
											<Link href={`/admin/clients/${client.id}/edit`}>
												<Button variant="ghost" size="sm">
													<Pencil className="h-4 w-4" />
												</Button>
											</Link>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
