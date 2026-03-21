import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageTransition } from "@/components/transition/page-transition";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<PageTransition />
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
		</>
	);
}
