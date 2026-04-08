import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { db } from "../lib/db";
import { events } from "../lib/db/schema/events";

async function main() {
	const allEvents = await db
		.select({
			title: events.title,
			imageUrl: events.imageUrl,
		})
		.from(events);

	for (const e of allEvents) {
		console.log(`${e.title}: ${e.imageUrl ?? "(no image)"}`);
	}

	process.exit(0);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
