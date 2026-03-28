"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { Button } from "@/components/ui/button";
import { deleteClientAction, deleteClientsAction } from "@/lib/actions/clients";

type Client = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	isActive: boolean;
	emailOptIn: boolean;
	totalEventsAttended: number;
	createdAt: Date;
};

interface ClientsTableProps {
	clients: Client[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [deleting, setDeleting] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const filtered = search
		? clients.filter(
				(c) =>
					c.firstName.toLowerCase().includes(search.toLowerCase()) ||
					c.lastName.toLowerCase().includes(search.toLowerCase()) ||
					c.email.toLowerCase().includes(search.toLowerCase()),
			)
		: clients;

	const allFilteredSelected =
		filtered.length > 0 && filtered.every((c) => selected.has(c.id));

	function toggleAll() {
		if (allFilteredSelected) {
			const newSelected = new Set(selected);
			for (const c of filtered) newSelected.delete(c.id);
			setSelected(newSelected);
		} else {
			const newSelected = new Set(selected);
			for (const c of filtered) newSelected.add(c.id);
			setSelected(newSelected);
		}
	}

	function toggleOne(id: string) {
		const newSelected = new Set(selected);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelected(newSelected);
	}

	async function handleBulkDelete() {
		setDeleting(true);
		await deleteClientsAction(Array.from(selected));
		setSelected(new Set());
		setDeleting(false);
		setShowConfirm(false);
	}

	return (
		<div>
			<div className="mb-4 flex items-center gap-3">
				<input
					type="text"
					placeholder="Search clients..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full max-w-sm rounded-sm border border-input bg-background px-3 py-2 text-sm"
				/>

				{selected.size > 0 && (
					<>
						{showConfirm ? (
							<div className="flex items-center gap-2 rounded-sm border border-rust/30 bg-rust/10 px-3 py-1.5 text-sm">
								<span>
									Delete {selected.size} client{selected.size !== 1 ? "s" : ""}?
								</span>
								<Button
									size="sm"
									variant="outline"
									onClick={() => setShowConfirm(false)}
									disabled={deleting}
								>
									Cancel
								</Button>
								<Button
									size="sm"
									onClick={handleBulkDelete}
									disabled={deleting}
									className="bg-rust text-cream hover:bg-rust-light"
								>
									{deleting ? "Deleting..." : "Confirm"}
								</Button>
							</div>
						) : (
							<Button
								size="sm"
								variant="outline"
								onClick={() => setShowConfirm(true)}
								className="gap-1.5 text-rust hover:bg-rust/10 hover:text-rust"
							>
								<Trash2 className="h-3.5 w-3.5" />
								Delete {selected.size} selected
							</Button>
						)}
					</>
				)}
			</div>

			<div className="overflow-x-auto rounded-sm ring-1 ring-border">
				<table className="w-full text-sm">
					<thead className="bg-cream text-left">
						<tr>
							<th className="px-4 py-3">
								<input
									type="checkbox"
									checked={allFilteredSelected}
									onChange={toggleAll}
									className="h-4 w-4 rounded border-border accent-rust"
								/>
							</th>
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
								Mailing List
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border bg-cream/50">
						{filtered.length === 0 ? (
							<tr>
								<td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
									No clients found
								</td>
							</tr>
						) : (
							filtered.map((client) => (
								<tr
									key={client.id}
									className={`hover:bg-cream ${selected.has(client.id) ? "bg-rust/5" : ""}`}
								>
									<td className="px-4 py-3">
										<input
											type="checkbox"
											checked={selected.has(client.id)}
											onChange={() => toggleOne(client.id)}
											className="h-4 w-4 rounded border-border accent-rust"
										/>
									</td>
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
										<span
											className={`inline-flex rounded-sm px-2 py-0.5 text-xs font-medium ${
												client.emailOptIn
													? "bg-blue-100 text-blue-800"
													: "bg-mid-gray/10 text-muted-foreground"
											}`}
										>
											{client.emailOptIn ? "Subscribed" : "Unsubscribed"}
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
											<DeleteDialog
												title={`${client.firstName} ${client.lastName}`}
												onConfirm={async () => {
													await deleteClientAction(client.id);
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
		</div>
	);
}
