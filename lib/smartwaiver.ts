const SMARTWAIVER_API_BASE = "https://api.smartwaiver.com";

function getApiKey(): string {
	const key = process.env.SMARTWAIVER_API_KEY;
	if (!key) throw new Error("SMARTWAIVER_API_KEY env var is not set");
	return key;
}

/** Fetch full waiver details from SmartWaiver API v4. */
export async function getWaiverDetails(waiverId: string) {
	const response = await fetch(`${SMARTWAIVER_API_BASE}/v4/waivers/${waiverId}`, {
		headers: { "sw-api-key": getApiKey() },
	});

	if (!response.ok) {
		throw new Error(`SmartWaiver API error: ${response.status}`);
	}

	return response.json();
}
