"use client";

import { motion } from "motion/react";

interface PageHeroProps {
	title: string;
	subtitle?: string;
	image: string;
}

export function PageHero({ title, subtitle, image }: PageHeroProps) {
	return (
		<section className="relative flex h-[40vh] min-h-[320px] items-center justify-center overflow-hidden">
			{/* Background */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: `url(${image})` }}
			/>
			<div className="absolute inset-0 hero-gradient" />

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-4xl font-heading uppercase tracking-tight text-white sm:text-5xl lg:text-6xl"
				>
					{title}
				</motion.h1>
				{subtitle && (
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="mt-4 text-lg font-sans text-white/80 sm:text-xl"
					>
						{subtitle}
					</motion.p>
				)}
				<motion.div
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="mx-auto mt-6 h-px w-24 bg-rust"
				/>
			</div>
		</section>
	);
}
