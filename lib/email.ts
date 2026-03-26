import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = process.env.EMAIL_FROM || "Monterey Bay Veterans <onboarding@resend.dev>";

export async function sendRegistrationConfirmation({
	to,
	firstName,
	role,
	eventTitle,
	eventDate,
	eventTime,
	eventLocation,
}: {
	to: string;
	firstName: string;
	role: "participant" | "volunteer";
	eventTitle: string;
	eventDate: string;
	eventTime: string | null;
	eventLocation: string | null;
}) {
	const roleLabel = role === "volunteer" ? "volunteer" : "participant";
	const dateFormatted = new Date(`${eventDate}T00:00:00`).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	await resend.emails.send({
		from: EMAIL_FROM,
		to: [to],
		subject: `Registration Received — ${eventTitle}`,
		html: `
			<div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a202c;">
				<h1 style="color: #1a365d; font-size: 24px; margin-bottom: 4px;">Monterey Bay Veterans</h1>
				<hr style="border: none; border-top: 2px solid #c0392b; margin: 16px 0;" />

				<p>Hi ${firstName},</p>

				<p>Thank you for signing up as a <strong>${roleLabel}</strong> for:</p>

				<div style="background: #f7fafc; border-left: 4px solid #c0392b; padding: 12px 16px; margin: 16px 0;">
					<p style="margin: 0; font-weight: bold; font-size: 18px;">${eventTitle}</p>
					<p style="margin: 4px 0 0; color: #4a5568;">${dateFormatted}${eventTime ? ` at ${eventTime}` : ""}</p>
					${eventLocation ? `<p style="margin: 4px 0 0; color: #4a5568;">${eventLocation}</p>` : ""}
				</div>

				<p>Your registration has been received and is <strong>pending review</strong>. You should expect to hear back from us soon with full confirmation details.</p>

				<p>If you have any questions in the meantime, feel free to reach out to us.</p>

				<p style="margin-top: 24px;">— The Monterey Bay Veterans Team</p>

				<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
				<p style="color: #a0aec0; font-size: 12px;">You received this email because you signed up for an event at Monterey Bay Veterans.</p>
			</div>
		`,
	});
}

export async function sendStatusUpdateEmail({
	to,
	firstName,
	role,
	status,
	eventTitle,
	eventDate,
	eventTime,
	eventLocation,
	reason,
}: {
	to: string;
	firstName: string;
	role: string;
	status: "registered" | "cancelled";
	eventTitle: string;
	eventDate: string;
	eventTime: string | null;
	eventLocation: string | null;
	reason?: string;
}) {
	const approved = status === "registered";
	const roleLabel = role === "volunteer" ? "volunteer" : "participant";
	const dateFormatted = new Date(`${eventDate}T00:00:00`).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const subject = approved
		? `You're Confirmed — ${eventTitle}`
		: `Registration Update — ${eventTitle}`;

	const reasonBlock = reason
		? `<div style="background: #fff5f5; border-left: 4px solid #c0392b; padding: 12px 16px; margin: 12px 0;">
				<p style="margin: 0; font-weight: 600; font-size: 13px; color: #718096; text-transform: uppercase;">Reason</p>
				<p style="margin: 4px 0 0; color: #1a202c;">${reason}</p>
			</div>`
		: "";

	const message = approved
		? `<p>Great news! Your registration as a <strong>${roleLabel}</strong> has been <strong style="color: #276749;">approved</strong>.</p>
			<p>We look forward to seeing you there!</p>`
		: `<p>Unfortunately, your registration as a <strong>${roleLabel}</strong> was <strong style="color: #c0392b;">not approved</strong> at this time.</p>
			${reasonBlock}
			<p>If you have any questions, please don't hesitate to reach out to us.</p>`;

	await resend.emails.send({
		from: EMAIL_FROM,
		to: [to],
		subject,
		html: `
			<div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a202c;">
				<h1 style="color: #1a365d; font-size: 24px; margin-bottom: 4px;">Monterey Bay Veterans</h1>
				<hr style="border: none; border-top: 2px solid #c0392b; margin: 16px 0;" />

				<p>Hi ${firstName},</p>

				${message}

				${
					approved
						? `<div style="background: #f7fafc; border-left: 4px solid #276749; padding: 12px 16px; margin: 16px 0;">
					<p style="margin: 0; font-weight: bold; font-size: 18px;">${eventTitle}</p>
					<p style="margin: 4px 0 0; color: #4a5568;">${dateFormatted}${eventTime ? ` at ${eventTime}` : ""}</p>
					${eventLocation ? `<p style="margin: 4px 0 0; color: #4a5568;">${eventLocation}</p>` : ""}
				</div>`
						: ""
				}

				<p style="margin-top: 24px;">— The Monterey Bay Veterans Team</p>

				<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
				<p style="color: #a0aec0; font-size: 12px;">You received this email because you signed up for an event at Monterey Bay Veterans.</p>
			</div>
		`,
	});
}

type ReportEvent = {
	eventId: string;
	eventTitle: string;
	eventDate: string;
	registrations: {
		clientFirstName: string;
		clientLastName: string;
		role: string;
	}[];
};

export async function sendDailyRegistrationReport({
	events,
	adminEmails,
	baseUrl,
}: {
	events: ReportEvent[];
	adminEmails: string[];
	baseUrl: string;
}) {
	const yesterday = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/Los_Angeles",
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(Date.now() - 24 * 60 * 60 * 1000));

	const totalRegistrations = events.reduce((sum, e) => sum + e.registrations.length, 0);

	const eventSections = events
		.map(
			(event) => `
			<div style="margin-bottom: 24px;">
				<div style="background: #f7fafc; border-left: 4px solid #c0392b; padding: 12px 16px; margin-bottom: 8px;">
					<a href="${baseUrl}/admin/events/${event.eventId}"
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
							<td style="padding: 6px 8px;">
								<span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; background: ${r.role === "volunteer" ? "#ebf8ff" : "#f0fff4"}; color: ${r.role === "volunteer" ? "#2b6cb0" : "#276749"};">
									${r.role}
								</span>
							</td>
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

	await resend.emails.send({
		from: EMAIL_FROM,
		to: adminEmails,
		subject: `Daily Registration Report — ${yesterday}`,
		html: `
			<div style="font-family: sans-serif; max-width: 620px; margin: 0 auto; color: #1a202c;">
				<h1 style="color: #1a365d; font-size: 24px; margin-bottom: 4px;">Monterey Bay Veterans</h1>
				<hr style="border: none; border-top: 2px solid #c0392b; margin: 16px 0;" />

				<h2 style="font-size: 18px; margin-bottom: 4px;">Daily Registration Report</h2>
				<p style="color: #4a5568; margin-top: 0;">
					${yesterday} &mdash; ${totalRegistrations} new registration${totalRegistrations !== 1 ? "s" : ""} across ${events.length} event${events.length !== 1 ? "s" : ""}
				</p>

				${eventSections}

				<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
				<p style="color: #a0aec0; font-size: 12px;">
					This report was generated from the Monterey Bay Veterans admin system.
					<a href="${baseUrl}/admin/events" style="color: #c0392b;">View all events</a>
				</p>
			</div>
		`,
	});
}

export async function sendEventCancellationEmail({
	to,
	firstName,
	eventTitle,
	eventDate,
	reason,
}: {
	to: string;
	firstName: string;
	eventTitle: string;
	eventDate: string;
	reason?: string;
}) {
	const dateFormatted = new Date(`${eventDate}T00:00:00`).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const reasonBlock = reason
		? `<div style="background: #fff5f5; border-left: 4px solid #c0392b; padding: 12px 16px; margin: 12px 0;">
				<p style="margin: 0; font-weight: 600; font-size: 13px; color: #718096; text-transform: uppercase;">Reason</p>
				<p style="margin: 4px 0 0; color: #1a202c;">${reason}</p>
			</div>`
		: "";

	await resend.emails.send({
		from: EMAIL_FROM,
		to: [to],
		subject: `Event Cancelled — ${eventTitle}`,
		html: `
			<div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a202c;">
				<h1 style="color: #1a365d; font-size: 24px; margin-bottom: 4px;">Monterey Bay Veterans</h1>
				<hr style="border: none; border-top: 2px solid #c0392b; margin: 16px 0;" />

				<p>Hi ${firstName},</p>

				<p>We regret to inform you that the following event has been <strong style="color: #c0392b;">cancelled</strong>:</p>

				<div style="background: #f7fafc; border-left: 4px solid #c0392b; padding: 12px 16px; margin: 16px 0;">
					<p style="margin: 0; font-weight: bold; font-size: 18px;">${eventTitle}</p>
					<p style="margin: 4px 0 0; color: #4a5568;">${dateFormatted}</p>
				</div>

				${reasonBlock}

				<p>We apologize for any inconvenience. Please check our events page for upcoming opportunities.</p>

				<p style="margin-top: 24px;">— The Monterey Bay Veterans Team</p>

				<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
				<p style="color: #a0aec0; font-size: 12px;">You received this email because you were registered for an event at Monterey Bay Veterans.</p>
			</div>
		`,
	});
}

export async function sendMembershipConfirmationEmail({
	to,
	firstName,
	type,
	expiresAt,
}: {
	to: string;
	firstName: string;
	type: "annual" | "lifetime";
	expiresAt?: Date | null;
}) {
	const typeLabel = type === "lifetime" ? "Lifetime" : "Annual";
	const expiryNote = expiresAt
		? `<p style="margin: 4px 0 0; color: #4a5568;">Valid until ${expiresAt.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>`
		: `<p style="margin: 4px 0 0; color: #4a5568;">Your membership never expires</p>`;

	await resend.emails.send({
		from: EMAIL_FROM,
		to: [to],
		subject: `Welcome, ${typeLabel} Member — Monterey Bay Veterans`,
		html: `
			<div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a202c;">
				<h1 style="color: #1a365d; font-size: 24px; margin-bottom: 4px;">Monterey Bay Veterans</h1>
				<hr style="border: none; border-top: 2px solid #c0392b; margin: 16px 0;" />

				<p>Hi ${firstName},</p>

				<p>Welcome to the Monterey Bay Veterans family! Your <strong>${typeLabel} Membership</strong> is now <strong style="color: #276749;">active</strong>.</p>

				<div style="background: #f7fafc; border-left: 4px solid #276749; padding: 12px 16px; margin: 16px 0;">
					<p style="margin: 0; font-weight: bold; font-size: 18px;">${typeLabel} Membership</p>
					${expiryNote}
				</div>

				<p>As a member, you enjoy voting rights at annual meetings, quarterly newsletters, invitations to member-only events, and more.</p>

				<p>Thank you for supporting our mission to serve disabled veterans.</p>

				<p style="margin-top: 24px;">— The Monterey Bay Veterans Team</p>

				<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
				<p style="color: #a0aec0; font-size: 12px;">You received this email because you became a member of Monterey Bay Veterans.</p>
			</div>
		`,
	});
}

export async function sendMembershipExpirationReminderEmail({
	to,
	firstName,
	expiresAt,
}: {
	to: string;
	firstName: string;
	expiresAt: Date;
}) {
	const expiryFormatted = expiresAt.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	await resend.emails.send({
		from: EMAIL_FROM,
		to: [to],
		subject: "Your MBV Membership is Expiring Soon",
		html: `
			<div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a202c;">
				<h1 style="color: #1a365d; font-size: 24px; margin-bottom: 4px;">Monterey Bay Veterans</h1>
				<hr style="border: none; border-top: 2px solid #c0392b; margin: 16px 0;" />

				<p>Hi ${firstName},</p>

				<p>Your annual membership with Monterey Bay Veterans is expiring on <strong>${expiryFormatted}</strong>.</p>

				<div style="background: #fefcbf; border-left: 4px solid #d69e2e; padding: 12px 16px; margin: 16px 0;">
					<p style="margin: 0; font-weight: bold; font-size: 16px; color: #975a16;">Membership Expiring Soon</p>
					<p style="margin: 4px 0 0; color: #744210;">Renew to keep your member benefits active.</p>
				</div>

				<p>Visit our website to renew your membership and continue supporting our mission to serve disabled veterans.</p>

				<p style="margin-top: 24px;">— The Monterey Bay Veterans Team</p>

				<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
				<p style="color: #a0aec0; font-size: 12px;">You received this email because you are a member of Monterey Bay Veterans.</p>
			</div>
		`,
	});
}
