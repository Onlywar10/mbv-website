import { MailX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Unsubscribed",
	robots: { index: false, follow: false },
};

export default function UnsubscribeConfirmedPage() {
	return (
		<section className="flex min-h-[60vh] items-center justify-center bg-cream px-4">
			<div className="max-w-md text-center">
				<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rust/10">
					<MailX className="h-8 w-8 text-rust" />
				</div>
				<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">
					You&apos;ve Been Unsubscribed
				</h1>
				<p className="mt-4 text-muted-foreground">
					You will no longer receive mailing list emails from Monterey Bay Veterans. If this was
					a mistake, please contact us at{" "}
					<a href="mailto:Info@mbv.org" className="text-rust hover:underline">
						Info@mbv.org
					</a>{" "}
					to re-subscribe.
				</p>
				<Link
					href="/"
					className="mt-8 inline-block rounded-sm bg-ink px-6 py-2 font-heading text-sm uppercase tracking-wider text-cream transition-colors hover:bg-ink-soft"
				>
					Back to Home
				</Link>
			</div>
		</section>
	);
}
