const SMARTWAIVER_API_BASE = "https://api.smartwaiver.com";

/** Fetch full waiver details from SmartWaiver API v4. */
export async function getWaiverDetails(waiverId: string, apiKey: string) {
	const response = await fetch(`${SMARTWAIVER_API_BASE}/v4/waivers/${waiverId}`, {
		headers: { "sw-api-key": apiKey },
	});

	if (!response.ok) {
		throw new Error(`SmartWaiver API error: ${response.status}`);
	}

	return response.json();
}

/** Build a prefilled SmartWaiver URL with participant info and event tag. */
export function buildPrefillUrl(params: {
	templateId: string;
	firstName: string;
	lastName: string;
	email: string;
	tag: string;
}): string {
	const base = `https://waiver.smartwaiver.com/w/${params.templateId}/web/`;
	const url = new URL(base);
	url.searchParams.set("wautofill_firstname", params.firstName);
	url.searchParams.set("wautofill_lastname", params.lastName);
	url.searchParams.set("wautofill_email", params.email);
	url.searchParams.set("wautofill_tag", params.tag);
	return url.toString();
}
