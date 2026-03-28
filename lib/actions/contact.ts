"use server";

import { sendContactNotification } from "@/lib/email";
import { getActiveAdminEmails } from "@/lib/queries/email";
import type { ActionState } from "@/lib/types";
import { contactFormSchema } from "@/lib/validations/contact";

export async function submitContactFormAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const parsed = contactFormSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const data = parsed.data;

	// Get admin emails to notify
	const admins = await getActiveAdminEmails();
	const adminEmails = admins.map((a) => a.email);

	if (adminEmails.length === 0) {
		return { error: "Unable to process your message at this time. Please try again later." };
	}

	try {
		await sendContactNotification({
			adminEmails,
			senderName: data.name,
			senderEmail: data.email,
			senderPhone: data.phone,
			subject: data.subject,
			message: data.message,
		});
	} catch (err) {
		console.error("Failed to send contact form notification:", err);
		return { error: "Failed to send your message. Please try again." };
	}

	return { success: "Your message has been sent! Our team will get back to you within 1-2 business days." };
}
