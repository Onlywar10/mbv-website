"use client";

import { CheckCircle, Info, Send } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { publicEventSignupAction } from "@/lib/actions/public";
import type { ActionState } from "@/lib/types";

interface EventSignupDialogProps {
	eventId: string;
	eventTitle: string;
	category: string;
}

const initialState: ActionState = {};

export function EventSignupDialog({ eventId, eventTitle, category }: EventSignupDialogProps) {
	const [state, formAction, isPending] = useActionState(publicEventSignupAction, initialState);
	const [hasGuest, setHasGuest] = useState(false);

	const showVaCheckbox = category === "fishing" || category === "derby";

	return (
		<Dialog>
			<DialogTrigger
				render={
					<button
						type="button"
						className="flex w-full items-center justify-center gap-2 rounded-sm bg-rust px-4 py-2.5 font-heading text-sm font-medium uppercase tracking-wider text-cream transition-colors hover:bg-rust-light"
					>
						Sign Up for This Event
					</button>
				}
			/>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Sign Up for Event</DialogTitle>
					<DialogDescription>{eventTitle}</DialogDescription>
				</DialogHeader>

				{state.success ? (
					<div className="flex flex-col items-center gap-3 py-4 text-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-rust/10">
							<CheckCircle className="h-6 w-6 text-rust" />
						</div>
						<p className="text-sm text-muted-foreground">{state.success}</p>
					</div>
				) : (
					<form action={formAction} className="space-y-4">
						<input type="hidden" name="eventId" value={eventId} />

						{state.error && (
							<div
								className="rounded-sm border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
								role="alert"
							>
								{state.error}
							</div>
						)}

						{/* Name row */}
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="signup-firstName">
									First Name <span className="text-destructive">*</span>
								</Label>
								<Input
									id="signup-firstName"
									name="firstName"
									placeholder="First name"
									required
									className="h-9"
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="signup-lastName">
									Last Name <span className="text-destructive">*</span>
								</Label>
								<Input
									id="signup-lastName"
									name="lastName"
									placeholder="Last name"
									required
									className="h-9"
								/>
							</div>
						</div>

						{/* Email */}
						<div className="space-y-1.5">
							<Label htmlFor="signup-email">
								Email <span className="text-destructive">*</span>
							</Label>
							<Input
								id="signup-email"
								name="email"
								type="email"
								placeholder="you@example.com"
								required
								className="h-9"
							/>
						</div>

						{/* Phone */}
						<div className="space-y-1.5">
							<Label htmlFor="signup-phone">
								Phone <span className="text-destructive">*</span>
							</Label>
							<Input
								id="signup-phone"
								name="phone"
								type="tel"
								placeholder="(831) 555-0000"
								required
								className="h-9"
							/>
						</div>

						{/* Guest checkbox */}
						<div className="space-y-3">
							<label className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									name="hasGuest"
									checked={hasGuest}
									onChange={(e) => setHasGuest(e.target.checked)}
									className="h-4 w-4 rounded border-gray-300"
								/>
								<span className="font-medium">I'm bringing a guest</span>
							</label>

							{hasGuest && (
								<div className="space-y-3 rounded-sm border border-border bg-muted/30 p-3">
									<p className="text-xs font-medium text-muted-foreground">Guest Information</p>
									<div className="grid gap-3 sm:grid-cols-2">
										<div className="space-y-1.5">
											<Label htmlFor="signup-guestFirstName">
												First Name <span className="text-destructive">*</span>
											</Label>
											<Input
												id="signup-guestFirstName"
												name="guestFirstName"
												placeholder="Guest first name"
												required
												className="h-9"
											/>
										</div>
										<div className="space-y-1.5">
											<Label htmlFor="signup-guestLastName">
												Last Name <span className="text-destructive">*</span>
											</Label>
											<Input
												id="signup-guestLastName"
												name="guestLastName"
												placeholder="Guest last name"
												required
												className="h-9"
											/>
										</div>
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="signup-guestEmail">
											Email <span className="text-destructive">*</span>
										</Label>
										<Input
											id="signup-guestEmail"
											name="guestEmail"
											type="email"
											placeholder="guest@example.com"
											required
											className="h-9"
										/>
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="signup-guestPhone">
											Phone <span className="text-destructive">*</span>
										</Label>
										<Input
											id="signup-guestPhone"
											name="guestPhone"
											type="tel"
											placeholder="(831) 555-0000"
											required
											className="h-9"
										/>
									</div>
								</div>
							)}
						</div>

						{/* VA Checkbox — only for fishing/derby events */}
						{showVaCheckbox && (
							<div className="space-y-2">
								<div className="flex items-start gap-2 rounded-sm border border-rust/20 bg-rust/5 p-3">
									<Info className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
									<p className="text-xs text-muted-foreground">
										Veterans with 40%+ VA disability rating do not need a fishing license. All other
										participants must have a valid California fishing license.
									</p>
								</div>
								<label className="flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										name="vaConfirmed"
										required
										className="h-4 w-4 rounded border-gray-300"
									/>
									<span>
										I am 40%+ VA rated <strong>or</strong> I have a valid fishing license
									</span>
								</label>
							</div>
						)}

						{/* Mailing list opt-in */}
						<label className="flex items-start gap-2 text-sm">
							<input
								type="checkbox"
								name="emailOptIn"
								defaultChecked
								className="mt-0.5 h-4 w-4 rounded border-gray-300"
							/>
							<span className="text-muted-foreground">
								I agree to receive emails from the MBV mailing list
							</span>
						</label>

						{/* Submit */}
						<Button
							type="submit"
							disabled={isPending}
							className="w-full rounded-sm bg-rust font-heading uppercase tracking-wider text-cream hover:bg-rust-light"
						>
							{isPending ? (
								<>
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
									Submitting...
								</>
							) : (
								<>
									<Send className="mr-2 h-4 w-4" />
									Submit Registration
								</>
							)}
						</Button>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
