import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/transition/page-transition";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Monterey Bay Veterans — Serving Those Who Served",
    template: "%s | Monterey Bay Veterans",
  },
  description:
    "Monterey Bay Veterans, Inc. provides free recreational fishing, whale watching, and community events for disabled veterans in the Monterey Bay area. Serving veterans since 1987.",
  keywords: [
    "Monterey Bay Veterans",
    "disabled veterans",
    "veteran fishing",
    "wheelchair accessible fishing",
    "Monterey Bay",
    "veteran nonprofit",
    "salmon derby",
    "whale watching veterans",
    "veteran community",
    "MBV",
  ],
  authors: [{ name: "Monterey Bay Veterans, Inc." }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Monterey Bay Veterans",
    title: "Monterey Bay Veterans — Serving Those Who Served",
    description:
      "Free recreational fishing, whale watching, and community events for disabled veterans in Monterey Bay. Over 5,000 veterans impacted annually since 1987.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Veterans fishing on Monterey Bay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Monterey Bay Veterans — Serving Those Who Served",
    description:
      "Free recreational fishing and community events for disabled veterans in Monterey Bay since 1987.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
