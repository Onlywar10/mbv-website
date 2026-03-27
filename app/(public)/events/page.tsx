import { Accessibility, Mail, MapPin, Phone, User } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { EventFilter } from "@/components/sections/event-filter";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { getRegistrationCountsByEvent, getPublishedEvents } from "@/lib/queries/events";

export const metadata: Metadata = {
	title: "Events & Contact",
	description:
		"Browse upcoming fishing trips, whale watching expeditions, and volunteer events. Contact Monterey Bay Veterans to get involved.",
};

export default async function EventsPage() {
	const [rawEvents, registrationCounts] = await Promise.all([
		getPublishedEvents(),
		getRegistrationCountsByEvent(),
	]);

	const events = rawEvents.map((e) => ({
		...e,
		spotsLeft: Math.max(0, e.participantCapacity - (registrationCounts[e.id]?.participants ?? 0)),
	}));

	return (
		<>
			{/* -- Hero ------------------------------------------ */}
			<PageHero
				title="Events & Contact"
				subtitle="Join us on the water or get in touch"
				image="/images/events/event-image.png"
				imagePosition="center 30%"
			/>

			{/* -- Events Section -------------------------------- */}
			<section className="bg-cream py-20" aria-labelledby="events-heading">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<ScrollReveal>
						<SectionHeading
							title="Upcoming Events"
							subtitle="From deep-sea fishing to whale watching, find an adventure that speaks to you."
						/>
					</ScrollReveal>

					<ScrollReveal delay={0.15}>
						<EventFilter events={events} />
					</ScrollReveal>
				</div>
			</section>

			{/* -- Contact Section ------------------------------- */}
			<section className="bg-stone py-20" id="contact" aria-labelledby="contact-heading">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<ScrollReveal>
						<SectionHeading
							title="Get In Touch"
							subtitle="Have questions about our programs? Want to sign up for an event or volunteer? We'd love to hear from you."
						/>
					</ScrollReveal>

					<div className="grid gap-12 lg:grid-cols-2">
						{/* Left: Contact Form */}
						<ScrollReveal direction="left" delay={0.1}>
							<div>
								<h3 className="mb-6 text-xl font-semibold text-primary">Send Us a Message</h3>
								<ContactForm />
							</div>
						</ScrollReveal>

						{/* Right: Contact Info */}
						<ScrollReveal direction="right" delay={0.2}>
							<div className="flex flex-col gap-6">
								<h3 className="text-xl font-semibold text-primary">Contact Information</h3>

								<Card className="rounded-sm ring-1 ring-border shadow-sharp">
									<CardContent className="space-y-6 pt-2">
										{/* Phone */}
										<div className="flex items-start gap-4">
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-rust/10">
												<Phone className="h-5 w-5 text-rust" />
											</div>
											<div>
												<p className="font-medium text-primary">Phone</p>
												<a
													href="tel:+18315962558"
													className="text-muted-foreground transition-colors hover:text-rust"
												>
													(831) 596-2558
												</a>
											</div>
										</div>

										{/* General Email */}
										<div className="flex items-start gap-4">
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-rust/10">
												<Mail className="h-5 w-5 text-rust" />
											</div>
											<div>
												<p className="font-medium text-primary">Email</p>
												<a
													href="mailto:Info@mbv.org"
													className="text-muted-foreground transition-colors hover:text-rust"
												>
													Info@mbv.org
												</a>
											</div>
										</div>

										{/* Executive Director */}
										<div className="flex items-start gap-4">
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-rust/10">
												<User className="h-5 w-5 text-rust" />
											</div>
											<div>
												<p className="font-medium text-primary">Executive Director</p>
												<p className="text-muted-foreground">Jefferson Ward</p>
												<a
													href="mailto:Jefferson@mbv.org"
													className="text-sm text-muted-foreground transition-colors hover:text-rust"
												>
													Jefferson@mbv.org
												</a>
											</div>
										</div>

										{/* Address */}
										<div className="flex items-start gap-4">
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-rust/10">
												<MapPin className="h-5 w-5 text-rust" />
											</div>
											<div>
												<p className="font-medium text-primary">Mailing Address</p>
												<address className="not-italic text-muted-foreground">
													P.O. Box 481
													<br />
													Monterey, CA 93942
												</address>
											</div>
										</div>

										{/* ADA Shuttle Info */}
										<div className="flex items-start gap-4">
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-rust/10">
												<Accessibility className="h-5 w-5 text-rust" />
											</div>
											<div>
												<p className="font-medium text-primary">ADA Shuttle Service</p>
												<p className="text-sm text-muted-foreground">
													We provide wheelchair-accessible shuttles for disabled veterans attending
													local community events, including raceway, golf, and fairground events
													throughout Monterey County.
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Extra CTA */}
								<Card className="rounded-sm bg-ink text-cream shadow-sharp">
									<CardContent className="pt-2">
										<h4 className="mb-2 text-lg font-semibold">Ready to Join Us?</h4>
										<p className="text-sm text-primary-foreground/80">
											Whether you are a veteran looking to get out on the water, a volunteer eager
											to give back, or a supporter wanting to make a difference, we welcome you.
											Reach out today and become part of the MBV family.
										</p>
									</CardContent>
								</Card>
							</div>
						</ScrollReveal>
					</div>
				</div>
			</section>
		</>
	);
}
