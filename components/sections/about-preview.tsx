"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AboutPreview() {
	return (
		<section className="bg-white py-12 sm:py-20 lg:py-28">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
					{/* Left: Content */}
					<ScrollReveal direction="left">
						<div>
							<span className="mb-3 inline-block text-xs font-heading uppercase tracking-wider text-rust sm:mb-4">
								About MBV
							</span>
							<h2 className="font-heading text-2xl tracking-tight text-ink sm:text-3xl lg:text-4xl">
								More Than Fishing — It&apos;s About Healing
							</h2>
							<div className="mt-3 h-1 w-16 bg-rust sm:mt-4 sm:w-20" />
							<p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
								Since 1987, Monterey Bay Veterans has been dedicated to improving the quality of
								life for disabled veterans through the therapeutic power of the ocean.
								<span className="hidden sm:inline">
									{" "}What started as a single wheelchair-accessible salmon derby has grown into a
									year-round program impacting over 5,000 veterans annually.
								</span>
							</p>
							<p className="mt-3 hidden text-lg leading-relaxed text-muted-foreground sm:block sm:mt-4">
								Our programs include free deep-sea fishing trips, whale watching expeditions,
								community events, and ADA shuttle services — all designed to bring veterans
								together, reduce isolation, and create lasting memories on the beautiful waters of
								Monterey Bay.
							</p>
							<div className="mt-6 sm:mt-8">
								<Link
									href="/about"
									className={cn(
										buttonVariants({ size: "lg" }),
										"h-10 gap-2 rounded-sm bg-ink px-5 text-sm font-heading uppercase text-white hover:bg-ink-soft sm:h-11 sm:px-6 sm:text-base",
									)}
								>
									Learn Our Story
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>
						</div>
					</ScrollReveal>

					{/* Right: Image */}
					<ScrollReveal direction="right" delay={0.2}>
						<div className="relative">
							<div className="overflow-hidden rounded-sm shadow-sharp">
								<img
									src="/images/hero/MBV-Boat.png"
									alt="The Pescador — Monterey Bay Veterans boat on Monterey Bay"
									className="h-full w-full object-cover"
								/>
							</div>
							{/* Decorative accent — hidden on mobile to avoid overflow */}
							<div className="absolute -bottom-4 -right-4 -z-10 hidden h-full w-full rounded-sm bg-rust/10 sm:block" />
							{/* Floating stat card */}
							<div className="absolute -bottom-4 -left-2 rounded-sm bg-white p-3 shadow-sharp ring-1 ring-border sm:-bottom-6 sm:-left-6 sm:p-4">
								<div className="text-2xl font-bold text-rust sm:text-3xl">38+</div>
								<div className="text-xs font-medium text-ink sm:text-sm">Years Serving Veterans</div>
							</div>
						</div>
					</ScrollReveal>
				</div>
			</div>
		</section>
	);
}
