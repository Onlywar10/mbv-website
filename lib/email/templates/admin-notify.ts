import { formatFullDate } from "../format";
import { emailLayout } from "../layout";
import { sendEmail } from "../send";

// ---------------------------------------------------------------------------
// Admin Notification: New Donation
// ---------------------------------------------------------------------------

interface DonationNotifyParams {
	adminEmails: string[];
	donorName: string;
	donorEmail: string;
	amount: string;
	paymentMethod: string;
}

export async function sendAdminDonationNotification(
	params: DonationNotifyParams,
): Promise<void> {
	const body = `
		<h2 style="font-size: 18px; margin-bottom: 4px;">New Donation Received</h2>
		<div style="background: #f7fafc; border-left: 4px solid #276749; padding: 12px 16px; margin: 16px 0;">
			<p style="margin: 0; font-weight: bold; font-size: 18px;">$${Number(params.amount).toLocaleString()}</p>
			<p style="margin: 4px 0 0; color: #4a5568;"><strong>From:</strong> ${params.donorName} (${params.donorEmail})</p>
			<p style="margin: 4px 0 0; color: #4a5568;"><strong>Method:</strong> ${params.paymentMethod}</p>
		</div>`;

	await sendEmail({
		to: params.adminEmails,
		subject: `New Donation: $${Number(params.amount).toLocaleString()} from ${params.donorName}`,
		html: emailLayout({
			body,
			showSignature: false,
			disclaimer: "This notification was sent from the Monterey Bay Veterans admin system.",
		}),
	});
}

// ---------------------------------------------------------------------------
// Admin Notification: New Membership
// ---------------------------------------------------------------------------

interface MembershipNotifyParams {
	adminEmails: string[];
	memberName: string;
	memberEmail: string;
	type: "annual" | "lifetime";
	isRenewal: boolean;
	expiresAt: Date | null;
	amount: string;
}

export async function sendAdminMembershipNotification(
	params: MembershipNotifyParams,
): Promise<void> {
	const typeLabel = params.type === "lifetime" ? "Lifetime" : "Annual";
	const action = params.isRenewal ? "Renewal" : "New Membership";
	const expiryLine = params.expiresAt
		? `<p style="margin: 4px 0 0; color: #4a5568;"><strong>Expires:</strong> ${formatFullDate(params.expiresAt)}</p>`
		: `<p style="margin: 4px 0 0; color: #4a5568;"><strong>Expires:</strong> Never</p>`;

	const body = `
		<h2 style="font-size: 18px; margin-bottom: 4px;">${action}: ${typeLabel} Member</h2>
		<div style="background: #f7fafc; border-left: 4px solid #276749; padding: 12px 16px; margin: 16px 0;">
			<p style="margin: 0; font-weight: bold; font-size: 16px;">${params.memberName}</p>
			<p style="margin: 4px 0 0; color: #4a5568;"><strong>Email:</strong> ${params.memberEmail}</p>
			<p style="margin: 4px 0 0; color: #4a5568;"><strong>Type:</strong> ${typeLabel}</p>
			<p style="margin: 4px 0 0; color: #4a5568;"><strong>Amount:</strong> $${Number(params.amount).toLocaleString()}</p>
			${expiryLine}
		</div>`;

	await sendEmail({
		to: params.adminEmails,
		subject: `${action}: ${params.memberName} (${typeLabel})`,
		html: emailLayout({
			body,
			showSignature: false,
			disclaimer: "This notification was sent from the Monterey Bay Veterans admin system.",
		}),
	});
}
