"use client";

import { CheckCircle, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactFormAction } from "@/lib/actions/contact";
import type { ActionState } from "@/lib/types";

export function ContactForm() {
	const [state, formAction, isPending] = useActionState<ActionState, FormData>(
		submitContactFormAction,
		{},
	);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Show success state when action succeeds
	if (state.success && !isSubmitted) {
		setIsSubmitted(true);
	}

	return (
		<AnimatePresence mode="wait">
			{isSubmitted ? (
				<motion.div
					key="success"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.4 }}
					className="flex flex-col items-center justify-center gap-4 rounded-sm border border-rust/20 bg-rust/5 p-8 text-center"
					role="status"
					aria-live="polite"
				>
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-rust/10">
						<CheckCircle className="h-8 w-8 text-rust" />
					</div>
					<h3 className="text-xl font-bold text-primary">Message Sent!</h3>
					<p className="max-w-sm text-muted-foreground">
						Thank you for reaching out. Our team will get back to you within 1-2 business days.
					</p>
					<Button variant="outline" onClick={() => setIsSubmitted(false)} className="mt-2">
						Send Another Message
					</Button>
				</motion.div>
			) : (
				<motion.form
					key="form"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					action={formAction}
					noValidate
					className="space-y-5"
				>
					{state.error && (
						<div className="rounded-sm bg-destructive/10 px-4 py-3 text-sm text-destructive">
							{state.error}
						</div>
					)}

					{/* Name */}
					<div className="space-y-2">
						<Label htmlFor="contact-name">
							Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="contact-name"
							name="name"
							type="text"
							placeholder="Your full name"
							required
							className="h-10"
						/>
					</div>

					{/* Email */}
					<div className="space-y-2">
						<Label htmlFor="contact-email">
							Email <span className="text-destructive">*</span>
						</Label>
						<Input
							id="contact-email"
							name="email"
							type="email"
							placeholder="you@example.com"
							required
							className="h-10"
						/>
					</div>

					{/* Phone (optional) */}
					<div className="space-y-2">
						<Label htmlFor="contact-phone">
							Phone <span className="text-muted-foreground">(optional)</span>
						</Label>
						<Input
							id="contact-phone"
							name="phone"
							type="tel"
							placeholder="(831) 555-0000"
							className="h-10"
						/>
					</div>

					{/* Subject */}
					<div className="space-y-2">
						<Label htmlFor="contact-subject">
							Subject <span className="text-destructive">*</span>
						</Label>
						<Input
							id="contact-subject"
							name="subject"
							type="text"
							placeholder="e.g., Event Sign-Up, Volunteer Inquiry, General Question"
							required
							className="h-10"
						/>
					</div>

					{/* Message */}
					<div className="space-y-2">
						<Label htmlFor="contact-message">
							Message <span className="text-destructive">*</span>
						</Label>
						<Textarea
							id="contact-message"
							name="message"
							placeholder="Tell us how we can help..."
							rows={5}
							required
						/>
					</div>

					{/* Submit */}
					<Button
						type="submit"
						size="lg"
						disabled={isPending}
						className="w-full rounded-sm bg-rust font-heading uppercase tracking-wider text-cream hover:bg-rust-light"
					>
						{isPending ? (
							<>
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
								Sending...
							</>
						) : (
							<>
								<Send className="mr-2 h-4 w-4" />
								Send Message
							</>
						)}
					</Button>
				</motion.form>
			)}
		</AnimatePresence>
	);
}
