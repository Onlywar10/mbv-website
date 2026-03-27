"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
	value: number;
	suffix?: string;
	label: string;
	description?: string;
	light?: boolean;
}

export function AnimatedCounter({
	value,
	suffix = "",
	label,
	description,
	light = false,
}: AnimatedCounterProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!isInView) return;

		const duration = 2000;
		const steps = 60;
		const stepValue = value / steps;
		let current = 0;
		const interval = setInterval(() => {
			current += stepValue;
			if (current >= value) {
				setCount(value);
				clearInterval(interval);
			} else {
				setCount(Math.floor(current));
			}
		}, duration / steps);

		return () => clearInterval(interval);
	}, [isInView, value]);

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className="text-center"
		>
			<div
				className={`text-4xl font-heading sm:text-5xl lg:text-6xl ${
					light ? "text-rust" : "text-ink"
				}`}
			>
				{count.toLocaleString()}
				{suffix}
			</div>
			<div
				className={`mt-2 text-lg font-heading uppercase tracking-wider ${
					light ? "text-white" : "text-primary"
				}`}
			>
				{label}
			</div>
			{description && (
				<p className={`mt-1 text-sm ${light ? "text-white/70" : "text-muted-foreground"}`}>
					{description}
				</p>
			)}
		</motion.div>
	);
}
