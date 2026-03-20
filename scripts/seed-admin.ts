import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../lib/db/schema/users";
import { hashPassword } from "../lib/auth/password";

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  const email = process.argv[2] || "admin@mbv.org";
  const password = process.argv[3] || "changeme123";
  const name = process.argv[4] || "Admin";

  const passwordHash = await hashPassword(password);

  await db.insert(users).values({
    email: email.toLowerCase(),
    passwordHash,
    name,
    role: "admin",
  });

  console.log(`Admin user created: ${email}`);
  console.log("Change the password after first login!");
}

seed().catch(console.error);
