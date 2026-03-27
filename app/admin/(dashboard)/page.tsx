import {
	Calendar,
	CalendarCheck,
	Clock,
	DollarSign,
	Hand,
	MapPin,
	UserCheck,
	UserPlus,
	Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/admin/stat-card";
import {
	getDashboardStats,
	getRecentRegistrations,
	getUpcomingEventsWithCapacity,
} from "@/lib/queries/dashboard";

export const metadata: Metadata = {
	title: "Admin Dashboard",
	robots: { index: false, follow: false },
};

function formatDate(dateStr: string) {
	return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	});
}

function formatTimestamp(date: Date) {
	return new Date(date).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

const categoryColors: Record<string, string> = {
	fishing: "bg-blue-100 text-blue-800",
	"whale-watching": "bg-cyan-100 text-cyan-800",
	volunteer: "bg-green-100 text-green-800",
	community: "bg-amber-100 text-amber-800",
	derby: "bg-purple-100 text-purple-800",
};

export default async function DashboardPage() {
	const [stats, upcomingEvents, recentRegistrations] = await Promise.all([
		getDashboardStats(),
		getUpcomingEventsWithCapacity(3),
		getRecentRegistrations(5),
	]);

	return (
		<div>
			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">
				Dashboard
			</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Overview of Monterey Bay Veterans
			</p>

			{/* Stats Grid */}
			<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					label="Pending Applications"
					value={stats.pendingApplications}
					icon={UserPlus}
				/>
				<StatCard
					label="Active Members"
					value={stats.activeMembers}
					icon={UserCheck}
				/>
				<StatCard
					label="Total Clients"
					value={stats.totalClients}
					icon={Users}
				/>
				<StatCard
					label="Total Donations"
					value={`$${Number(stats.totalDonations).toLocaleString()}`}
					icon={DollarSign}
				/>
			</div>

			<div className="mt-8 grid gap-6 lg:grid-cols-2">
				{/* Upcoming Events */}
				<div className="rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
					<div className="flex items-center justify-between">
						<h2 className="font-heading text-lg uppercase tracking-tight text-primary">
							Upcoming Events
						</h2>
						<Link
							href="/admin/events"
							className="text-sm font-medium text-rust hover:underline"
						>
							View all
						</Link>
					</div>

					{upcomingEvents.length === 0 ? (
						<p className="mt-4 text-sm text-muted-foreground">
							No upcoming events scheduled.
						</p>
					) : (
						<div className="mt-4 space-y-4">
							{upcomingEvents.map((event) => (
								<Link
									key={event.id}
									href={`/admin/events/${event.id}`}
									className="block rounded-sm border border-border p-4 transition-colors hover:bg-muted/50"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<h3 className="truncate font-semibold text-primary">
													{event.title}
												</h3>
												<span
													className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[event.category] ?? "bg-gray-100 text-gray-800"}`}
												>
													{event.category}
												</span>
											</div>
											<div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
												<span className="flex items-center gap-1">
													<Calendar className="h-3.5 w-3.5" />
													{formatDate(event.date)}
												</span>
												{event.time && (
													<span className="flex items-center gap-1">
														<Clock className="h-3.5 w-3.5" />
														{event.time}
													</span>
												)}
												{event.location && (
													<span className="flex items-center gap-1">
														<MapPin className="h-3.5 w-3.5" />
														{event.location}
													</span>
												)}
											</div>
										</div>
									</div>

									{/* Capacity bars */}
									<div className="mt-3 space-y-2">
										<div>
											<div className="flex items-center justify-between text-xs text-muted-foreground">
												<span className="flex items-center gap-1">
													<Users className="h-3 w-3" />
													Participants
												</span>
												<span>
													{event.participantCount} / {event.participantCapacity}
													{event.spotsLeft > 0 && (
														<span className="ml-1 text-green-700">
															({event.spotsLeft} left)
														</span>
													)}
													{event.spotsLeft === 0 && (
														<span className="ml-1 font-medium text-rust">
															(Full)
														</span>
													)}
												</span>
											</div>
											<div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
												<div
													className={`h-full rounded-full transition-all ${event.spotsLeft === 0 ? "bg-rust" : "bg-primary"}`}
													style={{
														width: `${Math.min(100, event.participantCapacity > 0 ? (event.participantCount / event.participantCapacity) * 100 : 0)}%`,
													}}
												/>
											</div>
										</div>

										{event.volunteerEnabled && (
											<div>
												<div className="flex items-center justify-between text-xs text-muted-foreground">
													<span className="flex items-center gap-1">
														<Hand className="h-3 w-3" />
														Volunteers
													</span>
													<span>
														{event.volunteerCount} / {event.volunteerCapacity}
														{event.volunteersNeeded > 0 && (
															<span className="ml-1 font-medium text-amber-700">
																({event.volunteersNeeded} needed)
															</span>
														)}
														{event.volunteersNeeded === 0 &&
															event.volunteerCapacity > 0 && (
																<span className="ml-1 text-green-700">
																	(Filled)
																</span>
															)}
													</span>
												</div>
												<div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
													<div
														className="h-full rounded-full bg-amber-500 transition-all"
														style={{
															width: `${Math.min(100, event.volunteerCapacity > 0 ? (event.volunteerCount / event.volunteerCapacity) * 100 : 0)}%`,
														}}
													/>
												</div>
											</div>
										)}
									</div>
								</Link>
							))}
						</div>
					)}
				</div>

				{/* Recent Registrations */}
				<div className="rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
					<div className="flex items-center justify-between">
						<h2 className="font-heading text-lg uppercase tracking-tight text-primary">
							Recent Registrations
						</h2>
						<Link
							href="/admin/clients"
							className="text-sm font-medium text-rust hover:underline"
						>
							View all
						</Link>
					</div>

					{recentRegistrations.length === 0 ? (
						<p className="mt-4 text-sm text-muted-foreground">
							No registrations yet.
						</p>
					) : (
						<div className="mt-4 divide-y divide-border">
							{recentRegistrations.map((reg) => (
								<div
									key={reg.id}
									className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
								>
									<div className="min-w-0">
										<p className="truncate font-medium text-primary">
											{reg.firstName} {reg.lastName}
										</p>
										<p className="truncate text-sm text-muted-foreground">
											{reg.eventTitle}
										</p>
									</div>
									<div className="flex shrink-0 flex-col items-end gap-1">
										<div className="flex items-center gap-1.5">
											<span
												className={`rounded-full px-2 py-0.5 text-xs font-medium ${
													reg.role === "volunteer"
														? "bg-blue-100 text-blue-800"
														: "bg-green-100 text-green-800"
												}`}
											>
												{reg.role}
											</span>
											<span
												className={`rounded-full px-2 py-0.5 text-xs font-medium ${
													reg.status === "registered"
														? "bg-green-100 text-green-800"
														: reg.status === "waitlisted"
															? "bg-amber-100 text-amber-800"
															: reg.status === "cancelled"
																? "bg-red-100 text-red-800"
																: "bg-gray-100 text-gray-800"
												}`}
											>
												{reg.status}
											</span>
										</div>
										<span className="text-xs text-muted-foreground">
											{formatTimestamp(reg.registeredAt)}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Quick Stats Row */}
			<div className="mt-6 grid gap-4 sm:grid-cols-3">
				<StatCard
					label="Total Events"
					value={stats.totalEvents}
					icon={Calendar}
				/>
				<StatCard
					label="Upcoming Events"
					value={stats.upcomingEvents}
					icon={CalendarCheck}
				/>
				<StatCard
					label="Total Registrations"
					value={stats.totalRegistrations}
					icon={Users}
				/>
			</div>
		</div>
	);
}
