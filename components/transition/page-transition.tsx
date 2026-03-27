"use client";

import { animate } from "motion";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const SQUARE_SIZE = 100;
const FILL_DURATION = 0.5;
const COVER_HOLD = 0.25;

/** Fisher-Yates shuffle */
function shuffle(length: number): number[] {
	const arr = Array.from({ length }, (_, i) => i);
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

export function PageTransition() {
	const router = useRouter();
	const pathname = usePathname();
	const containerRef = useRef<HTMLDivElement>(null);
	const isAnimating = useRef(false);
	const pathnameRef = useRef(pathname);

	useEffect(() => {
		pathnameRef.current = pathname;
	}, [pathname]);

	const triggerTransition = useCallback(
		(href: string) => {
			if (isAnimating.current) return;

			const container = containerRef.current;
			if (!container) return;

			isAnimating.current = true;

			// -- Build grid ---------------------------------------
			const sw = window.innerWidth;
			const sh = window.innerHeight;
			const cols = Math.ceil(sw / SQUARE_SIZE);
			const rows = Math.ceil(sh / SQUARE_SIZE);
			const total = cols * rows;

			container.style.width = `${cols * SQUARE_SIZE}px`;
			container.style.height = `${rows * SQUARE_SIZE}px`;

			const squares: HTMLDivElement[] = [];
			const fragment = document.createDocumentFragment();

			for (let i = 0; i < total; i++) {
				const sq = document.createElement("div");
				sq.style.cssText = `width:${SQUARE_SIZE}px;height:${SQUARE_SIZE}px;background:#1f2626;opacity:0;`;
				fragment.appendChild(sq);
				squares.push(sq);
			}
			container.appendChild(fragment);

			const perSquare = FILL_DURATION / total;

			// -- Phase 1: Cover (pixelate old page to dark) -------
			const coverOrder = shuffle(total);
			coverOrder.forEach((idx, order) => {
				animate(squares[idx], { opacity: [0, 1] }, { duration: 0.001, delay: order * perSquare });
			});

			// -- After cover completes: navigate, then reveal -----
			setTimeout(() => {
				// Swap the page behind the fully-opaque grid
				router.push(href);
				window.scrollTo({ top: 0, behavior: "instant" });

				// Phase 2: Reveal (pixelate dark away to show new page)
				// Deferred so motion doesn't cancel the phase 1 animations
				setTimeout(() => {
					const revealOrder = shuffle(total);
					revealOrder.forEach((idx, order) => {
						animate(
							squares[idx],
							{ opacity: [1, 0] },
							{ duration: 0.001, delay: order * perSquare },
						);
					});

					// Cleanup after reveal finishes
					setTimeout(
						() => {
							container.innerHTML = "";
							isAnimating.current = false;
						},
						(FILL_DURATION + 0.1) * 1000,
					);
				}, COVER_HOLD * 1000);
			}, FILL_DURATION * 1000);
		},
		[router],
	);

	// -- Intercept internal link clicks (capture phase) -------
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (isAnimating.current) {
				e.preventDefault();
				e.stopImmediatePropagation();
				return;
			}

			const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
			if (!anchor) return;

			const href = anchor.getAttribute("href");
			if (!href) return;

			if (/^(https?:|mailto:|tel:|javascript:)/.test(href)) return;
			if (href.startsWith("#")) return;

			const [targetPath] = href.split("#");
			if (targetPath === pathnameRef.current) return;

			e.preventDefault();
			e.stopImmediatePropagation();
			triggerTransition(href);
		};

		document.addEventListener("click", handleClick, true);
		return () => document.removeEventListener("click", handleClick, true);
	}, [triggerTransition]);

	return (
		<div
			ref={containerRef}
			aria-hidden="true"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				display: "flex",
				flexWrap: "wrap",
				justifyContent: "flex-start",
				alignContent: "flex-start",
				overflow: "hidden",
				zIndex: 9999,
				pointerEvents: "none",
			}}
		/>
	);
}
