"use client";

import { Calendar, Heart, Home, Info } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
	{ href: "/", label: "Home", icon: Home },
	{ href: "/about", label: "About & Impact", icon: Info },
	{ href: "/events", label: "Events & Contact", icon: Calendar },
	{ href: "/support", label: "Get Involved", icon: Heart },
];

interface MobileNavProps {
	onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			className="fixed inset-0 z-40 lg:hidden"
		>
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />

			{/* Panel */}
			<motion.nav
				initial={{ x: "100%" }}
				animate={{ x: 0 }}
				exit={{ x: "100%" }}
				transition={{ type: "spring", damping: 30, stiffness: 300 }}
				className="absolute right-0 top-14 bottom-0 w-80 bg-cream shadow-sharp"
			>
				<div className="flex flex-col h-full">
					{/* Links */}
					<div className="flex-1 px-4 py-6 space-y-1">
						{navLinks.map((link, i) => {
							const Icon = link.icon;
							return (
								<motion.div
									key={link.href}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1 + i * 0.05 }}
								>
									<Link
										href={link.href}
										onClick={onClose}
										className="flex items-center gap-3 rounded-sm px-4 py-3 font-heading uppercase text-foreground hover:bg-muted transition-colors"
									>
										<Icon className="h-5 w-5 text-rust" />
										<span className="font-medium">{link.label}</span>
									</Link>
								</motion.div>
							);
						})}
					</div>

					{/* CTA */}
					<div className="border-t border-border p-6">
						<Link
							href="/support"
							onClick={onClose}
							className={cn(
								buttonVariants(),
								"w-full uppercase font-heading bg-rust hover:bg-rust text-cream",
							)}
						>
							Support Our Mission
						</Link>
						<div className="mt-4 text-center text-sm text-muted-foreground">
							<a href="tel:8315962558" className="hover:text-rust">
								(831) 596-2558
							</a>
							<span className="mx-2">|</span>
							<a href="mailto:Info@mbv.org" className="hover:text-rust">
								Info@mbv.org
							</a>
						</div>
					</div>
				</div>
			</motion.nav>
		</motion.div>
	);
}
