"use client";

import { Quote } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { testimonials } from "@/lib/data";

export function TestimonialCarousel() {
	const [current, setCurrent] = useState(0);
	const [direction, setDirection] = useState(1);

	const goTo = useCallback(
		(index: number) => {
			setDirection(index > current ? 1 : -1);
			setCurrent(index);
		},
		[current],
	);

	useEffect(() => {
		const timer = setInterval(() => {
			setDirection(1);
			setCurrent((prev) => (prev + 1) % testimonials.length);
		}, 6000);
		return () => clearInterval(timer);
	}, []);

	const testimonial = testimonials[current];

	const variants = {
		enter: (dir: number) => ({
			x: dir > 0 ? 60 : -60,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (dir: number) => ({
			x: dir > 0 ? -60 : 60,
			opacity: 0,
		}),
	};

	return (
		<section className="bg-cream py-20 lg:py-28">
			<div className="mx-auto max-w-4xl px-6">
				<ScrollReveal>
					<SectionHeading
						title="Voices of Our Veterans"
						subtitle="Hear from the men and women whose lives have been touched by Monterey Bay Veterans."
					/>
				</ScrollReveal>

				<ScrollReveal delay={0.2}>
					<div className="relative mx-auto flex h-[420px] max-w-3xl flex-col">
						{/* Quote icon */}
						<Quote className="mx-auto mb-6 h-10 w-10 shrink-0 text-ochre/50" />

						{/* Testimonial quote — fixed height, overflow clipped */}
						<div className="relative flex-1 overflow-hidden">
							<AnimatePresence mode="wait" custom={direction}>
								<motion.div
									key={testimonial.id}
									custom={direction}
									variants={variants}
									initial="enter"
									animate="center"
									exit="exit"
									transition={{ duration: 0.4, ease: "easeInOut" }}
									className="absolute inset-0 text-center"
								>
									<blockquote className="line-clamp-6 text-xl leading-relaxed font-sans font-medium text-ink italic sm:text-2xl">
										&ldquo;{testimonial.longQuote}&rdquo;
									</blockquote>
								</motion.div>
							</AnimatePresence>
						</div>

						{/* Name + branch — always at the bottom */}
						<div className="mt-6 flex shrink-0 items-center justify-center gap-4">
							<img
								src={testimonial.image}
								alt={testimonial.name}
								className="h-14 w-14 rounded-full object-cover ring-2 ring-rust/30"
							/>
							<div className="text-left">
								<div className="font-heading uppercase font-bold text-ink">{testimonial.name}</div>
								<div className="text-sm text-muted-foreground">
									{testimonial.branch} &middot; {testimonial.yearsServed}
								</div>
							</div>
						</div>

						{/* Navigation dots — pinned below name */}
						<div className="mt-4 flex shrink-0 items-center justify-center gap-2">
							{testimonials.map((_, index) => (
								<button
									key={index}
									onClick={() => goTo(index)}
									className={`h-2.5 rounded-full transition-all duration-300 ${
										index === current ? "w-8 bg-rust" : "w-2.5 bg-ink/20 hover:bg-ink/40"
									}`}
									aria-label={`Go to testimonial ${index + 1}`}
								/>
							))}
						</div>
					</div>
				</ScrollReveal>
			</div>
		</section>
	);
}
