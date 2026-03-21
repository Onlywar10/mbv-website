import { Calendar, CalendarCheck, DollarSign, Users } from "lucide-react";
import type { Metadata } from "next";
import { StatCard } from "@/components/admin/stat-card";
import { getDashboardStats } from "@/lib/queries/dashboard";

export const metadata: Metadata = {
	title: "Admin Dashboard",
	robots: { index: false, follow: false },
};

export default async function DashboardPage() {
	const stats = await getDashboardStats();

	return (
		<div>
			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Dashboard</h1>
			<p className="mt-1 text-sm text-muted-foreground">Overview of Monterey Bay Veterans</p>

			<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard label="Total Events" value={stats.totalEvents} icon={Calendar} />
				<StatCard label="Upcoming Events" value={stats.upcomingEvents} icon={CalendarCheck} />
				<StatCard label="Total Clients" value={stats.totalClients} icon={Users} />
				<StatCard
					label="Total Donations"
					value={`$${Number(stats.totalDonations).toLocaleString()}`}
					icon={DollarSign}
				/>
			</div>
		</div>
	);
}
