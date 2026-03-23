import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { events } from "@/lib/db/schema/events";
import { users } from "@/lib/db/schema/users";

export async function getWaitlistedRegistrations() {
	return db
		.select({
			eventId: events.id,
			eventTitle: events.title,
			eventDate: events.date,
			clientFirstName: clients.firstName,
			clientLastName: clients.lastName,
			role: eventRegistrations.role,
		})
		.from(eventRegistrations)
		.innerJoin(events, eq(eventRegistrations.eventId, events.id))
		.innerJoin(clients, eq(eventRegistrations.clientId, clients.id))
		.where(eq(eventRegistrations.status, "waitlisted"))
		.orderBy(events.title, eventRegistrations.registeredAt);
}

export async function getActiveAdminEmails() {
	return db
		.select({ email: users.email, name: users.name })
		.from(users)
		.where(and(eq(users.role, "admin"), eq(users.isActive, true)));
}
