/**
 * Format a date string (YYYY-MM-DD) into a readable format.
 * Uses T00:00:00 suffix to prevent timezone offset shifting the day.
 */
export function formatEventDate(dateString: string): string {
	return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

/** Format a Date object into a readable date string. */
export function formatFullDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

/** Render an event detail card with title, date, time, and location. */
export function eventDetailCard(params: {
	title: string;
	date: string;
	time?: string | null;
	location?: string | null;
	borderColor?: string;
}): string {
	const { title, date, time, location, borderColor = "#c0392b" } = params;
	const formattedDate = formatEventDate(date);

	return `
		<div style="background: #f7fafc; border-left: 4px solid ${borderColor}; padding: 12px 16px; margin: 16px 0;">
			<p style="margin: 0; font-weight: bold; font-size: 18px;">${title}</p>
			<p style="margin: 4px 0 0; color: #4a5568;">${formattedDate}${time ? ` at ${time}` : ""}</p>
			${location ? `<p style="margin: 4px 0 0; color: #4a5568;">${location}</p>` : ""}
		</div>`;
}

/** Render a reason block for rejections/cancellations. Returns empty string if no reason. */
export function reasonBlock(reason?: string): string {
	if (!reason) return "";

	return `
		<div style="background: #fff5f5; border-left: 4px solid #c0392b; padding: 12px 16px; margin: 12px 0;">
			<p style="margin: 0; font-weight: 600; font-size: 13px; color: #718096; text-transform: uppercase;">Reason</p>
			<p style="margin: 4px 0 0; color: #1a202c;">${reason}</p>
		</div>`;
}

/** Render a colored role badge (volunteer or participant). */
export function roleBadge(role: string): string {
	const isVolunteer = role === "volunteer";
	const bg = isVolunteer ? "#ebf8ff" : "#f0fff4";
	const color = isVolunteer ? "#2b6cb0" : "#276749";

	return `<span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; background: ${bg}; color: ${color};">${role}</span>`;
}
