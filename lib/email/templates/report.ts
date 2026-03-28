import { roleBadge } from "../format";
import { emailLayout } from "../layout";
import { sendEmail } from "../send";

// ---------------------------------------------------------------------------
// Daily Registration Report
// ---------------------------------------------------------------------------

export type ReportEvent = {
	eventId: string;
	eventTitle: string;
	eventDate: string;
	registrations: {
		clientFirstName: string;
		clientLastName: string;
		role: string;
	}[];
};

interface DailyReportParams {
	events: ReportEvent[];
	adminEmails: string[];
	baseUrl: string;
}

export async function sendDailyRegistrationReport(
	params: DailyReportParams,
): Promise<void> {
	const yesterday = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/Los_Angeles",
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(Date.now() - 24 * 60 * 60 * 1000));

	const totalRegistrations = params.events.reduce(
		(sum, e) => sum + e.registrations.length,
		0,
	);

	const eventSections = params.events
		.map(
			(event) => `
			<div style="margin-bottom: 24px;">
				<div style="background: #f7fafc; border-left: 4px solid #c0392b; padding: 12px 16px; margin-bottom: 8px;">
					<a href="${params.baseUrl}/admin/events/${event.eventId}"
						style="color: #1a365d; font-size: 16px; font-weight: bold; text-decoration: none;">
						${event.eventTitle}
					</a>
					<p style="margin: 4px 0 0; color: #4a5568; font-size: 13px;">${event.eventDate}</p>
				</div>
				<table style="width: 100%; border-collapse: collapse; font-size: 14px;">
					<thead>
						<tr style="border-bottom: 1px solid #e2e8f0;">
							<th style="text-align: left; padding: 6px 8px; color: #718096; font-weight: 600; font-size: 12px; text-transform: uppercase;">Name</th>
							<th style="text-align: left; padding: 6px 8px; color: #718096; font-weight: 600; font-size: 12px; text-transform: uppercase;">Role</th>
						</tr>
					</thead>
					<tbody>
						${event.registrations
							.map(
								(r) => `
						<tr style="border-bottom: 1px solid #edf2f7;">
							<td style="padding: 6px 8px;">${r.clientFirstName} ${r.clientLastName}</td>
							<td style="padding: 6px 8px;">${roleBadge(r.role)}</td>
						</tr>`,
							)
							.join("")}
					</tbody>
				</table>
				<p style="margin: 4px 0 0; color: #a0aec0; font-size: 12px; padding-left: 8px;">
					${event.registrations.length} registration${event.registrations.length !== 1 ? "s" : ""}
				</p>
			</div>`,
		)
		.join("");

	const body = `
		<h2 style="font-size: 18px; margin-bottom: 4px;">Daily Registration Report</h2>
		<p style="color: #4a5568; margin-top: 0;">
			${yesterday} &mdash; ${totalRegistrations} new registration${totalRegistrations !== 1 ? "s" : ""} across ${params.events.length} event${params.events.length !== 1 ? "s" : ""}
		</p>
		${eventSections}`;

	await sendEmail({
		to: params.adminEmails,
		subject: `Daily Registration Report — ${yesterday}`,
		html: emailLayout({
			body,
			maxWidth: 620,
			showSignature: false,
			disclaimer: `This report was generated from the Monterey Bay Veterans admin system. <a href="${params.baseUrl}/admin/events" style="color: #c0392b;">View all events</a>`,
		}),
	});
}
