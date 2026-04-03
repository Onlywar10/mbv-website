import { formatFullDate } from "../format";
import { emailLayout } from "../layout";
import { sendEmail } from "../send";

// ---------------------------------------------------------------------------
// Membership Confirmation
// ---------------------------------------------------------------------------

interface MembershipConfirmationParams {
	to: string;
	firstName: string;
	type: "annual" | "lifetime";
	expiresAt?: Date | null;
}

export async function sendMembershipConfirmationEmail(
	params: MembershipConfirmationParams,
): Promise<void> {
	const typeLabel = params.type === "lifetime" ? "Lifetime" : "Annual";
	const expiryNote = params.expiresAt
		? `<p style="margin: 4px 0 0; color: #4a5568;">Valid until ${formatFullDate(params.expiresAt)}</p>`
		: `<p style="margin: 4px 0 0; color: #4a5568;">Your membership never expires</p>`;

	const body = `
		<p>Hi ${params.firstName},</p>
		<p>Welcome to the Monterey Bay Veterans family! Your <strong>${typeLabel} Membership</strong> is now <strong style="color: #276749;">active</strong>.</p>
		<div style="background: #f7fafc; border-left: 4px solid #276749; padding: 12px 16px; margin: 16px 0;">
			<p style="margin: 0; font-weight: bold; font-size: 18px;">${typeLabel} Membership</p>
			${expiryNote}
		</div>
		<p>As a member, you enjoy voting rights at annual meetings, quarterly newsletters, invitations to member-only events, and more.</p>
		<p>Thank you for supporting our mission to serve disabled veterans.</p>`;

	await sendEmail({
		to: params.to,
		subject: `Welcome, ${typeLabel} Member — Monterey Bay Veterans`,
		html: emailLayout({
			body,
			disclaimer:
				"You received this email because you became a member of Monterey Bay Veterans.",
		}),
	});
}

// ---------------------------------------------------------------------------
// Membership Expired
// ---------------------------------------------------------------------------

interface MembershipExpiredParams {
	to: string;
	firstName: string;
	type: "annual" | "lifetime";
	expiresAt: Date;
}

export async function sendMembershipExpiredEmail(
	params: MembershipExpiredParams,
): Promise<void> {
	const typeLabel = params.type === "lifetime" ? "Lifetime" : "Annual";

	const body = `
		<p>Hi ${params.firstName},</p>
		<p>We wanted to let you know that your <strong>${typeLabel} Membership</strong> with Monterey Bay Veterans has <strong style="color: #c0392b;">expired</strong> as of ${formatFullDate(params.expiresAt)}.</p>
		<p>We'd love to have you continue as part of the MBV family! Renewing your membership helps us continue providing free fishing trips, whale watching expeditions, and community events for disabled veterans.</p>
		<p>To renew, please visit our website or reach out to us directly.</p>`;

	await sendEmail({
		to: params.to,
		subject: "Your Membership Has Expired — Monterey Bay Veterans",
		html: emailLayout({
			body,
			disclaimer:
				"You received this email because you were a member of Monterey Bay Veterans.",
		}),
	});
}
