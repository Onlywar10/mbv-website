import { createHmac } from "node:crypto";

function getSecret(): string {
	return process.env.RESEND_API_KEY || "fallback-unsubscribe-secret";
}

/** Generate an HMAC token for an email address to prevent unauthorized unsubscribes. */
export function generateUnsubscribeToken(email: string): string {
	return createHmac("sha256", getSecret()).update(email.toLowerCase()).digest("hex");
}

/** Verify an unsubscribe token matches the email. */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
	const expected = generateUnsubscribeToken(email);
	return expected === token;
}

/** Build a full unsubscribe URL for a given email. */
export function buildUnsubscribeUrl(email: string): string {
	const token = generateUnsubscribeToken(email);
	const baseUrl = process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: "http://localhost:3000";

	return `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}
