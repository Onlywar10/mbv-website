import { Accessibility, CalendarDays, ChevronLeft, Clock, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventSignupDialog } from "@/components/sections/event-signup-dialog";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventBySlug, getPublishedEvents, getRegistrationCount } from "@/lib/queries/events";
import type { PublicEvent } from "@/lib/types";

// -- Dynamic metadata ---------------------------------------

type PageProps = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const event = await getEventBySlug(slug);

	if (!event) {
		return { title: "Event Not Found" };
	}

	return {
		title: event.title,
		description: event.description,
		openGraph: {
			title: event.title,
			description: event.description ?? undefined,
			images: event.imageUrl
				? [{ url: event.imageUrl, width: 800, height: 500, alt: event.title }]
				: undefined,
		},
	};
}

// -- Category helpers ---------------------------------------

const categoryColors: Record<PublicEvent["category"], string> = {
	fishing: "bg-rust text-cream",
	"whale-watching": "bg-ink text-cream",
	volunteer: "bg-ochre text-ink",
	community: "bg-secondary text-cream",
	derby: "bg-ink text-cream",
};

const categoryLabels: Record<PublicEvent["category"], string> = {
	fishing: "Fishing",
	"whale-watching": "Whale Watching",
	volunteer: "Volunteer",
	community: "Community",
	derby: "Derby",
};

// -- Page component -----------------------------------------

export default async function EventDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const event = await getEventBySlug(slug);

	if (!event || !event.isPublished) {
		notFound();
	}

	const [allEvents, regCount] = await Promise.all([
		getPublishedEvents(),
		getRegistrationCount(event.id),
	]);

	const spotsLeft = Math.max(0, event.participantCapacity - regCount);
	const related = allEvents
		.filter((e) => e.slug !== event.slug)
		.sort((a, b) => {
			if (a.category === event.category && b.category !== event.category) return -1;
			if (a.category !== event.category && b.category === event.category) return 1;
			return 0;
		})
		.slice(0, 3);

	return (
		<>
			{/* -- Hero Image ------------------------------------ */}
			<section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
				<Image
					src={event.imageUrl || "/images/hero/MBV-Boat.png"}
					alt={event.title}
					fill
					priority
					className="object-cover"
					sizes="100vw"
				/>
				<div className="hero-gradient absolute inset-0" />

				{/* Back link over hero */}
				<div className="absolute top-24 left-0 z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
					<Link
						href="/events"
						className="inline-flex items-center gap-1 rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
					>
						<ChevronLeft className="h-4 w-4" />
						Back to Events
					</Link>
				</div>

				{/* Title over hero */}
				<div className="absolute inset-0 flex items-end">
					<div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
						<span
							className={`mb-3 inline-flex items-center rounded-sm px-3 py-1 text-xs font-semibold ${categoryColors[event.category]}`}
						>
							{categoryLabels[event.category]}
						</span>
						<h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
							{event.title}
						</h1>
					</div>
				</div>
			</section>

			{/* -- Event Details --------------------------------- */}
			<section className="bg-cream py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-12 lg:grid-cols-3">
						{/* Main Content — 2 cols */}
						<div className="min-w-0 lg:col-span-2 space-y-10">
							{/* Quick Info Bar */}
							<ScrollReveal>
								<div className="flex flex-wrap gap-6 rounded-sm bg-cream p-6 shadow-sharp ring-1 ring-border">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-sm bg-rust/10">
											<CalendarDays className="h-5 w-5 text-rust" />
										</div>
										<div>
											<p className="text-xs text-muted-foreground">Date</p>
											<p className="font-medium text-primary">{event.date}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-sm bg-rust/10">
											<Clock className="h-5 w-5 text-rust" />
										</div>
										<div>
											<p className="text-xs text-muted-foreground">Time</p>
											<p className="font-medium text-primary">{event.time}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-sm bg-rust/10">
											<MapPin className="h-5 w-5 text-rust" />
										</div>
										<div>
											<p className="text-xs text-muted-foreground">Location</p>
											<p className="font-medium text-primary">{event.location}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-sm bg-ochre/10">
											<Users className="h-5 w-5 text-ochre" />
										</div>
										<div>
											<p className="text-xs text-muted-foreground">Availability</p>
											<p className="font-medium text-primary">{spotsLeft} spots left</p>
										</div>
									</div>
								</div>
							</ScrollReveal>

							{/* Long Description */}
							<ScrollReveal delay={0.1}>
								<article className="overflow-hidden">
									<h2 className="mb-4 text-2xl font-bold text-primary">About This Event</h2>
									<p className="break-words text-lg leading-relaxed text-muted-foreground">
										{event.longDescription}
									</p>
								</article>
							</ScrollReveal>

							{/* Accessibility */}
							{event.accessibility && (
								<ScrollReveal delay={0.15}>
									<div className="rounded-sm border border-rust/20 bg-rust/5 p-6">
										<div className="flex items-start gap-4">
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-rust/10">
												<Accessibility className="h-5 w-5 text-rust" />
											</div>
											<div>
												<h3 className="mb-1 text-lg font-semibold text-primary">
													Accessibility Information
												</h3>
												<p className="text-muted-foreground">{event.accessibility}</p>
											</div>
										</div>
									</div>
								</ScrollReveal>
							)}
						</div>

						{/* Sidebar — 1 col */}
						<aside className="space-y-6">
							{/* Spots Available */}
							<ScrollReveal direction="right" delay={0.1}>
								<Card className="rounded-sm ring-1 ring-border shadow-sharp">
									<CardContent className="pt-2 text-center">
										<div className="mb-2 text-4xl font-bold text-rust">{spotsLeft}</div>
										<p className="text-sm font-medium text-muted-foreground">
											of {event.participantCapacity} Spots Available
										</p>
										<div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
											<div
												className="h-full rounded-full bg-rust transition-all"
												style={{
													width: `${event.participantCapacity > 0 ? Math.round((spotsLeft / event.participantCapacity) * 100) : 0}%`,
												}}
												role="progressbar"
												aria-valuenow={spotsLeft}
												aria-valuemax={event.participantCapacity}
												aria-label={`${spotsLeft} of ${event.participantCapacity} spots remaining`}
											/>
										</div>
										<p className="mt-2 text-xs text-muted-foreground">
											{regCount} registered — {spotsLeft > 0 ? "sign up today!" : "fully booked"}
										</p>
									</CardContent>
								</Card>
							</ScrollReveal>

							{/* CTA Card */}
							<ScrollReveal direction="right" delay={0.2}>
								<Card className="rounded-sm bg-ink text-cream shadow-sharp">
									<CardContent className="space-y-4 pt-2">
										<h3 className="text-lg font-bold">Ready to Sign Up?</h3>
										<p className="text-sm text-cream/80">
											Reserve your spot for this event. All programs are provided at no cost to
											veterans.
										</p>
										<EventSignupDialog
											eventId={event.id}
											eventTitle={event.title}
											category={event.category}
										/>
									</CardContent>
								</Card>
							</ScrollReveal>

							{/* Event Details Card */}
							<ScrollReveal direction="right" delay={0.3}>
								<Card className="rounded-sm ring-1 ring-border shadow-sharp">
									<CardHeader>
										<CardTitle className="text-base text-primary">Event Details</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4 text-sm">
										<div>
											<p className="font-medium text-primary">Category</p>
											<Badge className={`mt-1 ${categoryColors[event.category]}`}>
												{categoryLabels[event.category]}
											</Badge>
										</div>
										{event.category === "volunteer" ? (
											<div>
												<p className="font-medium text-primary">Support your Veteran Community</p>
											</div>
										) : (
											<>
												<div>
													<p className="font-medium text-primary">Cost</p>
													<p className="text-muted-foreground">Free for all veterans</p>
												</div>
												<div>
													<p className="font-medium text-primary">Veteran ID Required</p>
													<p className="text-muted-foreground">DD-214 or valid veteran ID</p>
												</div>
											</>
										)}
									</CardContent>
								</Card>
							</ScrollReveal>
						</aside>
					</div>
				</div>
			</section>

			{/* -- Related Events -------------------------------- */}
			<section className="bg-stone py-20" aria-labelledby="related-heading">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<ScrollReveal>
						<SectionHeading
							title="More Events"
							subtitle="Explore other upcoming opportunities to get out on the water or volunteer with MBV."
						/>
					</ScrollReveal>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{related.map((relEvent, i) => (
							<ScrollReveal key={relEvent.slug} delay={i * 0.1}>
								<Card className="h-full overflow-hidden rounded-sm ring-1 ring-border transition-shadow hover:shadow-sharp">
									<div className="relative aspect-[16/10] overflow-hidden">
										<Image
											src={relEvent.imageUrl || "/images/hero/MBV-Boat.png"}
											alt={relEvent.title}
											fill
											className="object-cover transition-transform duration-500 group-hover/card:scale-105"
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										/>
										<div className="absolute top-3 left-3">
											<span
												className={`inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-semibold ${categoryColors[relEvent.category]}`}
											>
												{categoryLabels[relEvent.category]}
											</span>
										</div>
									</div>

									<CardHeader className="pb-0">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<CalendarDays className="h-4 w-4 shrink-0 text-rust" />
											<time>{relEvent.date}</time>
										</div>
										<CardTitle className="text-lg leading-snug text-primary">
											{relEvent.title}
										</CardTitle>
									</CardHeader>

									<CardContent className="flex flex-col gap-3">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<MapPin className="h-4 w-4 shrink-0 text-rust" />
											<span className="truncate">{relEvent.location}</span>
										</div>
										<p className="text-sm text-muted-foreground line-clamp-2">
											{relEvent.description}
										</p>
									</CardContent>

									<CardFooter>
										<Link
											href={`/events/${relEvent.slug}`}
											className="inline-flex w-full items-center justify-center rounded-sm border border-border bg-background px-4 py-2 font-heading text-sm font-medium uppercase tracking-wider transition-colors hover:bg-muted"
										>
											View Details
										</Link>
									</CardFooter>
								</Card>
							</ScrollReveal>
						))}
					</div>

					<div className="mt-12 text-center">
						<Link
							href="/events"
							className="inline-flex items-center justify-center gap-1 rounded-sm border border-ink px-6 py-2.5 font-heading text-sm font-medium uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-cream"
						>
							<ChevronLeft className="h-4 w-4" />
							Back to All Events
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
