"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "motion/react";
import { MobileNav } from "./mobile-nav";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About & Impact" },
  { href: "/events", label: "Events & Contact" },
  { href: "/support", label: "Get Involved" },
];

export function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream shadow-sharp">
        <div className="flex h-14 items-center justify-end px-4 sm:px-6 lg:px-8">
          {/* Logo — top-aligned to header, overflows downward */}
          <Link
            href="/"
            className="absolute left-4 sm:left-6 lg:left-8 flex h-56 w-56 items-center justify-center rounded-full bg-cream"
            style={{ zIndex: 1, top: "calc(3.5rem - 7rem)" }}
          >
            <Image
              src="/MBV-Logo.png"
              alt="Monterey Bay Veterans"
              width={200}
              height={200}
              className="h-52 w-52 object-contain translate-y-7"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-sm px-5 py-2 text-base font-heading uppercase tracking-wide text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/support"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "ml-3 uppercase font-heading text-base bg-rust hover:bg-rust text-cream"
              )}
            >
              Support Our Mission
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-sm text-foreground hover:bg-muted lg:hidden transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* Spacer so content isn't hidden behind fixed header */}
      <div className="h-14" />

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileOpen && (
          <MobileNav onClose={() => setIsMobileOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
