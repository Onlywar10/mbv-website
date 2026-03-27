import { count, eq, gte, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
import { donations } from "@/lib/db/schema/donations";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { events } from "@/lib/db/schema/events";

export async function getDashboardStats() {
	const [eventCount] = await db.select({ value: count() }).from(events);
	const [publishedCount] = await db
		.select({ value: count() })
		.from(events)
		.where(eq(events.isPublished, true));
	const [clientCount] = await db.select({ value: count() }).from(clients);
	const [registrationCount] = await db.select({ value: count() }).from(eventRegistrations);

	const today = new Date().toISOString().split("T")[0];
	const [upcomingCount] = await db
		.select({ value: count() })
		.from(events)
		.where(gte(events.date, today));

	const [donationTotal] = await db.select({ value: sum(donations.amount) }).from(donations);

	return {
		totalEvents: eventCount?.value ?? 0,
		publishedEvents: publishedCount?.value ?? 0,
		upcomingEvents: upcomingCount?.value ?? 0,
		totalClients: clientCount?.value ?? 0,
		totalRegistrations: registrationCount?.value ?? 0,
		totalDonations: donationTotal?.value ?? "0",
	};
}
