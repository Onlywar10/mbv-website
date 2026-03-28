/** Verify that a cron request has a valid CRON_SECRET bearer token. */
export function verifyCronRequest(request: Request): boolean {
	const secret = process.env.CRON_SECRET;
	if (!secret) return false;

	const authHeader = request.headers.get("authorization");
	return authHeader === `Bearer ${secret}`;
}
