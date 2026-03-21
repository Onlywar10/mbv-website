"use client";

import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBanner() {
	return (
		<section className="relative overflow-hidden bg-rust py-20 lg:py-24">
			{/* Decorative background pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20" />
				<div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/15" />
			</div>

			<div className="relative mx-auto max-w-4xl px-6 text-center">
				<ScrollReveal>
					<Heart className="mx-auto mb-6 h-10 w-10 text-white/80" />
					<h2 className="font-heading uppercase text-3xl tracking-[-0.03em] text-cream sm:text-4xl lg:text-5xl">
						Join Our Mission
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
						Whether you volunteer your time, donate to our programs, or simply spread the word —
						every act of support helps a veteran experience the healing power of the ocean.
						Together, we can serve those who served.
					</p>
					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Link
							href="/support"
							className={cn(
								buttonVariants({ size: "lg" }),
								"h-12 gap-2 rounded-sm bg-cream px-8 text-base font-heading uppercase text-ink hover:bg-cream/90",
							)}
						>
							Get Involved
							<ArrowRight className="h-4 w-4" />
						</Link>
						<Link
							href="/support#donate"
							className={cn(
								buttonVariants({ variant: "outline", size: "lg" }),
								"h-12 rounded-sm border-cream/30 bg-cream/10 px-8 text-base font-heading uppercase text-white backdrop-blur-sm hover:bg-white/20 hover:text-white",
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
