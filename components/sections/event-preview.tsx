"use client";

import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EventPreviewProps {
	events: PublicEvent[];
}

export function EventPreview({ events }: EventPreviewProps) {
	const upcomingEvents = events.slice(0, 3);

	return (
		<section className="bg-cream py-20 lg:py-28">
			<div className="mx-auto max-w-6xl px-6">
				<ScrollReveal>
					<SectionHeading
						title="Upcoming Events"
						subtitle="Join us for fishing trips, whale watching expeditions, and community events — all free for veterans."
					/>
				</ScrollReveal>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{upcomingEvents.map((event, index) => (
						<motion.div
							key={event.slug}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{
								duration: 0.5,
								delay: index * 0.15,
								ease: "easeOut",
							}}
						>
							<Card className="group h-full overflow-hidden rounded-sm border border-border bg-cream transition-shadow duration-300 hover:shadow-sharp">
								{/* Event image */}
								<div className="relative aspect-[16/10] overflow-hidden">
									<img
										src={event.imageUrl || ""}
										alt={event.title}
										className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									{/* Date badge */}
									<div className="absolute top-3 left-3 rounded-sm bg-rust px-3 py-1.5 text-xs font-bold text-white">
										{event.date}
									</div>
									{/* Category badge */}
									<div className="absolute top-3 right-3 rounded-sm bg-ink/80 px-2.5 py-1 text-xs font-medium text-white capitalize backdrop-blur-sm">
										{event.category.replace("-", " ")}
									</div>
								</div>

								<CardHeader>
									<CardTitle className="text-lg font-heading font-bold text-ink leading-snug">
										{event.title}
									</CardTitle>
									<CardDescription className="flex flex-col gap-1 pt-1">
										<span className="flex items-center gap-1.5 text-sm text-muted-foreground">
											<Calendar className="h-3.5 w-3.5" />
											{event.time}
										</span>
										<span className="flex items-center gap-1.5 text-sm text-muted-foreground">
											<MapPin className="h-3.5 w-3.5" />
											{event.location}
										</span>
									</CardDescription>
								</CardHeader>

								<CardContent className="flex flex-1 flex-col">
									<p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
										{event.description}
									</p>
									<div className="mt-auto">
										<Link
											href={`/events/${event.slug}`}
											className="inline-flex items-center gap-1.5 text-sm font-semibold text-rust transition-colors hover:text-ink"
										>
											Learn More
											<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
										</Link>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				<ScrollReveal delay={0.3}>
					<div className="mt-12 text-center">
						<Link
							href="/events"
							className={cn(
								buttonVariants({ variant: "outline", size: "lg" }),
								"h-11 gap-2 rounded-sm border-ink/20 px-6 font-heading uppercase text-ink hover:bg-ink hover:text-cream",
							)}
						>
							View All Events
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</ScrollReveal>
			</div>
		</section>
	);
}
