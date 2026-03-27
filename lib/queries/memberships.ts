import { desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { memberships } from "@/lib/db/schema/memberships";

export async function getAllMemberships() {
	return db.select().from(memberships).orderBy(desc(memberships.createdAt));
}
