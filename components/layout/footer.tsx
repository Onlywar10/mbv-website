import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const quickLinks = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About & Impact" },
	{ href: "/events", label: "Events" },
	{ href: "/support", label: "Get Involved" },
];

const programLinks = [
	{ label: "Fishing Trips" },
	{ label: "Whale Watching" },
	{ label: "Salmon Derbies" },
	{ label: "ADA Shuttles" },
	{ label: "Volunteer Events" },
];

export function Footer() {
	return (
		<footer className="bg-ink text-primary-foreground">
			{/* Main Footer */}
			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
					{/* Brand */}
					<div className="sm:col-span-2 lg:col-span-1">
						<Link href="/">
							<Image
								src="/images/MBV-Logo.png"
								alt="Monterey Bay Veterans"
								width={160}
								height={80}
								className="h-14 w-auto object-contain brightness-0 invert"
								unoptimized
							/>
						</Link>
						<p className="mt-4 text-sm leading-relaxed text-white/70">
							Serving the disabled veteran community of Monterey Bay through recreational fishing,
							whale watching, and community events — free of charge since 1987.
						</p>
						<div className="mt-6 flex gap-3">
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-rust"
								aria-label="Facebook"
							>
								<Facebook className="h-5 w-5" />
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-rust"
								aria-label="Instagram"
							>
								<Instagram className="h-5 w-5" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-sm font-heading uppercase tracking-widest text-rust">
							Quick Links
						</h3>
						<ul className="mt-4 space-y-3">
							{quickLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-white/70 transition-colors hover:text-white"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Programs */}
					<div>
						<h3 className="text-sm font-heading uppercase tracking-widest text-rust">Programs</h3>
						<ul className="mt-4 space-y-3">
							{programLinks.map((link) => (
								<li key={link.label}>
									<span className="text-sm text-white/70">{link.label}</span>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-sm font-heading uppercase tracking-widest text-rust">Contact Us</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<a
									href="tel:8315962558"
									className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
								>
									<Phone className="h-4 w-4 shrink-0" />
									(831) 596-2558
								</a>
							</li>
							<li>
								<a
									href="mailto:Info@mbv.org"
									className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
								>
									<Mail className="h-4 w-4 shrink-0" />
									Info@mbv.org
								</a>
							</li>
							<li>
								<div className="flex items-start gap-2 text-sm text-white/70">
									<MapPin className="h-4 w-4 shrink-0 mt-0.5" />
									<span>
										P.O. Box 481
										<br />
										Monterey, CA 93942
									</span>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-white/10">
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
						<p className="text-xs text-white/50">
							&copy; {new Date().getFullYear()} Monterey Bay Veterans, Inc. All rights reserved.
							501(c)(3) Non-Profit Organization.
						</p>
						<p className="text-xs text-white/50">Serving disabled veterans since 1987</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
