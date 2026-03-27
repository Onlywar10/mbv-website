"use client";

import { ArrowRight } from "lucide-react";
import { useActionState } from "react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { publicVolunteerSignupAction } from "@/lib/actions/public";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

export function VolunteerForm() {
	const [state, formAction, isPending] = useActionState(publicVolunteerSignupAction, initialState);

	return (
		<section id="volunteer-form" className="bg-muted py-20">
			<div className="mx-auto max-w-3xl px-6">
				<ScrollReveal>
					<SectionHeading
						title="Sign Up to Volunteer"
						subtitle="Enter your info below, then choose which events you'd like to volunteer for"
					/>
				</ScrollReveal>

				<ScrollReveal delay={0.15}>
					<form
						action={formAction}
						className="space-y-6 rounded-sm bg-card p-6 ring-1 ring-border sm:p-8"
					>
						{state.error && (
							<div
								className="rounded-sm border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
								role="alert"
							>
								{state.error}
							</div>
						)}

						{/* Name row */}
						<div className="grid gap-6 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="vol-firstName">
									First Name <span className="text-destructive">*</span>
								</Label>
								<Input
									id="vol-firstName"
									name="firstName"
									placeholder="First name"
									required
									className="h-10"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="vol-lastName">
									Last Name <span className="text-destructive">*</span>
								</Label>
								<Input
									id="vol-lastName"
									name="lastName"
									placeholder="Last name"
									required
									className="h-10"
								/>
							</div>
						</div>

						{/* Email & Phone row */}
						<div className="grid gap-6 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="vol-email">
									Email <span className="text-destructive">*</span>
								</Label>
								<Input
									id="vol-email"
									name="email"
									type="email"
									placeholder="john@example.com"
									required
									className="h-10"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="vol-phone">
									Phone <span className="text-destructive">*</span>
								</Label>
								<Input
									id="vol-phone"
									name="phone"
									type="tel"
									placeholder="(831) 555-0123"
									required
									className="h-10"
								/>
							</div>
						</div>

						<Button
							type="submit"
							size="lg"
							disabled={isPending}
							className="h-11 w-full rounded-sm bg-rust font-heading uppercase tracking-wider text-cream hover:bg-rust-light sm:w-auto"
						>
							{isPending ? (
								<>
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
									Submitting...
								</>
							) : (
								<>
									Select Events
									<ArrowRight className="ml-2 h-4 w-4" />
								</>
							)}
						</Button>
					</form>
				</ScrollReveal>
			</div>
		</section>
	);
}
