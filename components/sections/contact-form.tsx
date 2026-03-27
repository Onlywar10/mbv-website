"use client";

import { CheckCircle, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
}

interface FormErrors {
	name?: string;
	email?: string;
	subject?: string;
	message?: string;
}

export function ContactForm() {
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	function validate(): boolean {
		const newErrors: FormErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!formData.subject.trim()) {
			newErrors.subject = "Subject is required";
		}

		if (!formData.message.trim()) {
			newErrors.message = "Message is required";
		} else if (formData.message.trim().length < 10) {
			newErrors.message = "Message must be at least 10 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		if (!validate()) return;

		setIsSubmitting(true);

		// Simulate form submission delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setIsSubmitting(false);
		setIsSubmitted(true);
	}

	function handleChange(field: keyof FormData, value: string) {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error for this field when user starts typing
		if (errors[field as keyof FormErrors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
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
					<Button
						variant="outline"
						onClick={() => {
							setIsSubmitted(false);
							setFormData({
								name: "",
								email: "",
								phone: "",
								subject: "",
								message: "",
							});
						}}
						className="mt-2"
					>
						Send Another Message
					</Button>
				</motion.div>
			) : (
				<motion.form
					key="form"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onSubmit={handleSubmit}
					noValidate
					className="space-y-5"
				>
					{/* Name */}
					<div className="space-y-2">
						<Label htmlFor="contact-name">
							Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="contact-name"
							type="text"
							placeholder="Your full name"
							value={formData.name}
							onChange={(e) => handleChange("name", e.target.value)}
							aria-invalid={!!errors.name}
							aria-describedby={errors.name ? "name-error" : undefined}
							className="h-10"
						/>
						{errors.name && (
							<p id="name-error" className="text-sm text-destructive" role="alert">
								{errors.name}
							</p>
						)}
					</div>

					{/* Email */}
					<div className="space-y-2">
						<Label htmlFor="contact-email">
							Email <span className="text-destructive">*</span>
						</Label>
						<Input
							id="contact-email"
							type="email"
							placeholder="you@example.com"
							value={formData.email}
							onChange={(e) => handleChange("email", e.target.value)}
							aria-invalid={!!errors.email}
							aria-describedby={errors.email ? "email-error" : undefined}
							className="h-10"
						/>
						{errors.email && (
							<p id="email-error" className="text-sm text-destructive" role="alert">
								{errors.email}
							</p>
						)}
					</div>

					{/* Phone (optional) */}
					<div className="space-y-2">
						<Label htmlFor="contact-phone">
							Phone <span className="text-muted-foreground">(optional)</span>
						</Label>
						<Input
							id="contact-phone"
							type="tel"
							placeholder="(831) 555-0000"
							value={formData.phone}
							onChange={(e) => handleChange("phone", e.target.value)}
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
							type="text"
							placeholder="e.g., Event Sign-Up, Volunteer Inquiry, General Question"
							value={formData.subject}
							onChange={(e) => handleChange("subject", e.target.value)}
							aria-invalid={!!errors.subject}
							aria-describedby={errors.subject ? "subject-error" : undefined}
							className="h-10"
						/>
						{errors.subject && (
							<p id="subject-error" className="text-sm text-destructive" role="alert">
								{errors.subject}
							</p>
						)}
					</div>

					{/* Message */}
					<div className="space-y-2">
						<Label htmlFor="contact-message">
							Message <span className="text-destructive">*</span>
						</Label>
						<Textarea
							id="contact-message"
							placeholder="Tell us how we can help..."
							rows={5}
							value={formData.message}
							onChange={(e) => handleChange("message", e.target.value)}
							aria-invalid={!!errors.message}
							aria-describedby={errors.message ? "message-error" : undefined}
						/>
						{errors.message && (
							<p id="message-error" className="text-sm text-destructive" role="alert">
								{errors.message}
							</p>
						)}
					</div>

					{/* Submit */}
					<Button
						type="submit"
						size="lg"
						disabled={isSubmitting}
						className="w-full rounded-sm bg-rust font-heading uppercase tracking-wider text-cream hover:bg-rust-light"
					>
						{isSubmitting ? (
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
