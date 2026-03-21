import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getClients } from "@/lib/queries/clients";
import { ClientsTable } from "./clients-table";

export const metadata: Metadata = {
	title: "Manage Clients",
	robots: { index: false, follow: false },
};

export default async function ClientsPage() {
	const clients = await getClients();

	return (
		<div>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Clients</h1>
					<p className="mt-1 text-sm text-muted-foreground">{clients.length} total clients</p>
				</div>
				<Link
					href="/admin/clients/new"
					className="inline-flex items-center gap-2 rounded-sm bg-rust px-4 py-2 font-heading text-sm uppercase tracking-wider text-cream transition-colors hover:bg-rust-light"
				>
					<Plus className="h-4 w-4" />
					New Client
				</Link>
			</div>

			<div className="mt-6">
				<ClientsTable clients={clients} />
			</div>
		</div>
	);
}
