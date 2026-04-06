import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema/team-members";

export async function getTeamMembers() {
	return db
		.select()
		.from(teamMembers)
		.orderBy(asc(teamMembers.sortOrder), asc(teamMembers.createdAt));
}

export async function getTeamMemberById(id: string) {
	const rows = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
	return rows[0] ?? null;
}
