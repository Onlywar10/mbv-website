import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/**
 * Format a stored phone number for display as (XXX) XXX-XXXX.
 * Handles 10-digit US numbers and 11-digit numbers with a leading 1.
 * Anything else is returned trimmed but otherwise unchanged.
 */
export function formatPhone(phone: string | null | undefined): string {
	if (!phone) return "";
	const digits = phone.replace(/\D/g, "");
	const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
	if (local.length !== 10) return phone.trim();
	return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
}

/** Digits-only tel: href for a stored phone number. */
export function phoneHref(phone: string): string {
	const digits = phone.replace(/\D/g, "");
	return `tel:${digits.length === 10 ? `+1${digits}` : `+${digits}`}`;
}
