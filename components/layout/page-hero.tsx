"use client";

import { motion } from "motion/react";

interface PageHeroProps {
	title: string;
	subtitle?: string;
	image: string;
	imagePosition?: string;
}

export function PageHero({ title, subtitle, image, imagePosition }: PageHeroProps) {
	return (
		<section className="relative flex h-[30vh] min-h-[200px] items-center justify-center overflow-hidden sm:h-[40vh] sm:min-h-[320px]">
			{/* Background */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: `url(${image})`, backgroundPosition: imagePosition }}
			/>
			<div className="absolute inset-0 hero-gradient" />

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-2xl font-heading uppercase tracking-tight text-white sm:text-5xl lg:text-6xl"
				>
					{title}
				</motion.h1>
				{subtitle && (
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="mt-2 hidden text-lg font-sans text-white/80 sm:mt-4 sm:block sm:text-xl"
					>
						{subtitle}
					</motion.p>
				)}
				<motion.div
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="mx-auto mt-3 h-px w-16 bg-rust sm:mt-6 sm:w-24"
				/>
			</div>
		</section>
	);
}
