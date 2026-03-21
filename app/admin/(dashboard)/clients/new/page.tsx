import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { createClientAction } from "@/lib/actions/clients";
import { ClientForm } from "../client-form";

export const metadata: Metadata = {
	title: "Add Client",
	robots: { index: false, follow: false },
};

export default function NewClientPage() {
	return (
		<div>
			<Link
				href="/admin/clients"
				className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
			>
				<ChevronLeft className="h-4 w-4" />
				Back to Clients
			</Link>

			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Add Client</h1>
			<p className="mt-1 text-sm text-muted-foreground">Enter the client's information below</p>

			<div className="mt-6 max-w-2xl rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
				<ClientForm action={createClientAction} />
			</div>
		</div>
	);
}
