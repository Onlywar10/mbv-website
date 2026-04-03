import { emailLayout } from "../layout";
import { sendEmail } from "../send";

// ---------------------------------------------------------------------------
// Donation Thank You
// ---------------------------------------------------------------------------

interface DonationThankYouParams {
	to: string;
	firstName: string;
	amount: string;
}

export async function sendDonationThankYouEmail(
	params: DonationThankYouParams,
): Promise<void> {
	const body = `
		<p>Hi ${params.firstName},</p>
		<p>Thank you for your generous donation of <strong>$${Number(params.amount).toLocaleString()}</strong> to Monterey Bay Veterans!</p>
		<p>Your contribution directly supports free fishing trips, whale watching expeditions, and community events for disabled veterans in the Monterey Bay area.</p>
		<p>Because of donors like you, we can continue serving those who served.</p>`;

	await sendEmail({
		to: params.to,
		subject: "Thank You for Your Donation — Monterey Bay Veterans",
		html: emailLayout({
			body,
			disclaimer:
				"You received this email because you made a donation to Monterey Bay Veterans.",
		}),
	});
}
