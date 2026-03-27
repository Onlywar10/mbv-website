import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateClientAction } from "@/lib/actions/clients";
import { getClientById } from "@/lib/queries/clients";
import { ClientForm } from "../../client-form";

export const metadata: Metadata = {
	title: "Edit Client",
	robots: { index: false, follow: false },
};

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function EditClientPage({ params }: PageProps) {
	const { id } = await params;
	const client = await getClientById(id);

	if (!client) notFound();

	const boundAction = updateClientAction.bind(null, id);

	return (
		<div>
			<Link
				href={`/admin/clients/${id}`}
				className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
			>
				<ChevronLeft className="h-4 w-4" />
				Back to Client
			</Link>

			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Edit Client</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				{client.firstName} {client.lastName}
			</p>

			<div className="mt-6 max-w-2xl rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
				<ClientForm
					action={boundAction}
					defaultValues={{
						firstName: client.firstName,
						lastName: client.lastName,
						email: client.email,
						phone: client.phone ?? "",
						address: client.address ?? "",
						city: client.city ?? "",
						state: client.state ?? "",
						zip: client.zip ?? "",
						notes: client.notes ?? "",
						isActive: client.isActive,
						emailOptIn: client.emailOptIn,
					}}
					submitLabel="Save Changes"
				/>
			</div>
		</div>
	);
}
