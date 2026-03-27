import { DollarSign } from "lucide-react";
import type { Metadata } from "next";
import { StatCard } from "@/components/admin/stat-card";
import { getAllDonations, getClients } from "@/lib/queries/clients";
import { DonationForm } from "./donation-form";
import { DonationsTable } from "./donations-table";

export const metadata: Metadata = {
	title: "Donations",
	robots: { index: false, follow: false },
};

export default async function DonationsPage() {
	const [donations, clients] = await Promise.all([getAllDonations(), getClients()]);

	const totalDonated = donations.reduce((sum, d) => sum + Number(d.amount), 0);

	return (
		<div>
			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Donations</h1>
			<p className="mt-1 text-sm text-muted-foreground">{donations.length} total donations</p>

			<div className="mt-6 max-w-xs">
				<StatCard
					label="Total Donated"
					value={`$${totalDonated.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
					icon={DollarSign}
				/>
			</div>

			<div className="mt-8">
				<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
					Log Donation
				</h2>
				<div className="rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
					<DonationForm clients={clients} />
				</div>
			</div>

			<div className="mt-8">
				<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
					All Donations
				</h2>
				<DonationsTable donations={donations} />
			</div>
		</div>
	);
}
