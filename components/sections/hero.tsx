"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VIDEOS = [
	"https://gqfrf4opw8f9z551.public.blob.vercel-storage.com/videos/MBV-HomeVideo-1.mp4",
	"https://gqfrf4opw8f9z551.public.blob.vercel-storage.com/videos/MBV-HomeVideo-2.mp4",
	"https://gqfrf4opw8f9z551.public.blob.vercel-storage.com/videos/MBV-HomeVideo-3.mp4",
];

const FADE_DURATION = 1000; // ms

export function Hero() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [fading, setFading] = useState(false);
	const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

	const nextIndex = (activeIndex + 1) % VIDEOS.length;

	const handleVideoEnd = useCallback(() => {
		// Start fading out the current video
		setFading(true);

		// Preload and start the next video so it's visible underneath
		const nextVideo = videoRefs.current[nextIndex];
		if (nextVideo) {
			nextVideo.currentTime = 0;
			nextVideo.play();
		}

		// After the fade completes, swap the active index
		setTimeout(() => {
			setFading(false);
			setActiveIndex(nextIndex);
		}, FADE_DURATION);
	}, [nextIndex]);

	// Autoplay the first video once it has enough data
	useEffect(() => {
		const firstVideo = videoRefs.current[0];
		if (!firstVideo) return;

		const tryPlay = () => {
			firstVideo.play().catch(() => {
				// Browser blocked autoplay — retry on user interaction
				const retry = () => {
					firstVideo.play();
					document.removeEventListener("touchstart", retry);
					document.removeEventListener("click", retry);
				};
				document.addEventListener("touchstart", retry, { once: true });
				document.addEventListener("click", retry, { once: true });
			});
		};

		if (firstVideo.readyState >= 3) {
			tryPlay();
		} else {
			firstVideo.addEventListener("canplay", tryPlay, { once: true });
		}
	}, []);

	return (
		<section className="relative -mt-14 flex min-h-screen items-center justify-center overflow-hidden bg-[#0b3d5e]">
			{/* Background videos */}
			<div className="absolute inset-0">
				{VIDEOS.map((src, i) => (
					<video
						key={src}
						ref={(el) => {
							videoRefs.current[i] = el;
						}}
						src={src}
						autoPlay={i === 0}
						muted
						playsInline
						preload={i === 0 ? "auto" : "none"}
						onEnded={i === activeIndex ? handleVideoEnd : undefined}
						className={cn(
							"absolute inset-0 h-full w-full object-cover object-center transition-opacity",
							i === activeIndex && !fading && "z-[1] opacity-100",
							i === activeIndex && fading && "z-[1] opacity-0",
							i === nextIndex && fading && "z-0 opacity-100",
							i !== activeIndex && i !== nextIndex && "z-0 opacity-0",
							i !== activeIndex && !fading && "z-0 opacity-0",
						)}
						style={{ transitionDuration: `${FADE_DURATION}ms` }}
					/>
				))}
				{/* Dark gradient overlay */}
				<div className="absolute inset-0 z-[2] hero-gradient" />
			</div>

			{/* Hero content */}
			<div className="relative z-10 mx-auto max-w-2xl px-5 py-6 text-center sm:rounded-lg sm:bg-black/40 sm:p-10 sm:backdrop-blur-sm">
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
					className="font-heading font-extrabold uppercase text-balance text-5xl leading-tight tracking-[-0.03em] text-white [-webkit-text-stroke:_1px_rgb(0_0_0_/_60%)] [text-shadow:_0_2px_12px_rgb(0_0_0_/_80%)] sm:font-bold sm:[-webkit-text-stroke:_0] sm:[text-shadow:_none] md:text-6xl lg:text-7xl"
				>
					Serving Those Who Served
					<span className="mt-2 block text-rust">— On the Waters of Monterey Bay</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
					className="mt-4 hidden text-lg leading-relaxed text-white/85 sm:block sm:mt-6 sm:text-xl"
				>
					Free recreational fishing, whale watching, and community events for disabled veterans
					since 1987.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
					className="mt-6 flex flex-row items-center justify-center gap-3 sm:mt-10 sm:gap-4"
				>
					<Link
						href="/events"
						className={cn(
							buttonVariants({ size: "lg" }),
							"h-11 rounded-sm bg-rust px-6 text-sm font-heading uppercase text-white hover:bg-rust-light sm:h-12 sm:px-8 sm:text-base",
						)}
					>
						View Events
					</Link>
					<Link
						href="/about"
						className={cn(
							buttonVariants({ variant: "outline", size: "lg" }),
							"h-11 rounded-sm border-cream/30 bg-cream/10 px-6 text-sm font-heading uppercase text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:h-12 sm:px-8 sm:text-base",
						)}
					>
						Learn More
					</Link>
				</motion.div>
			</div>

			{/* Scroll indicator — hidden on mobile */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.2, duration: 0.8 }}
				className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
			>
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
					className="flex flex-col items-center gap-2"
				>
					<span className="text-xs font-medium tracking-wider text-white/60 uppercase">
						Scroll to explore
					</span>
					<ChevronDown className="h-5 w-5 text-white/60" />
				</motion.div>
			</motion.div>
		</section>
	);
}
