"use client";

import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBanner() {
	return (
		<section className="relative overflow-hidden bg-rust py-12 sm:py-20 lg:py-24">
			{/* Decorative background pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20" />
				<div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/15" />
			</div>

			<div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
				<ScrollReveal>
					<Heart className="mx-auto mb-4 h-8 w-8 text-white/80 sm:mb-6 sm:h-10 sm:w-10" />
					<h2 className="font-heading uppercase text-2xl tracking-[-0.03em] text-cream sm:text-4xl lg:text-5xl">
						Join Our Mission
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white/85 sm:mt-4 sm:text-lg">
						Every act of support helps a veteran experience the healing power of the ocean.
						<span className="hidden sm:inline">
							{" "}Whether you volunteer your time, donate to our programs, or simply spread the
							word — together, we can serve those who served.
						</span>
					</p>
					<div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
						<Link
							href="/support"
							className={cn(
								buttonVariants({ size: "lg" }),
								"h-11 gap-2 rounded-sm bg-cream px-6 text-sm font-heading uppercase text-ink hover:bg-cream/90 sm:h-12 sm:px-8 sm:text-base",
							)}
						>
							Get Involved
							<ArrowRight className="h-4 w-4" />
						</Link>
						<Link
							href="/support#donate"
							className={cn(
								buttonVariants({ variant: "outline", size: "lg" }),
								"h-11 rounded-sm border-cream/30 bg-cream/10 px-6 text-sm font-heading uppercase text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:h-12 sm:px-8 sm:text-base",
							)}
						>
							Make a Donation
						</Link>
					</div>
				</ScrollReveal>
			</div>
		</section>
	);
}
