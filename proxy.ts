import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "session_token";

function isPublicPath(pathname: string) {
	return (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/favicon") ||
		pathname.startsWith("/robots.txt") ||
		pathname.startsWith("/sitemap.xml") ||
		pathname.startsWith("/images/") ||
		pathname.startsWith("/admin/login") ||
		pathname.startsWith("/api/") ||
		!pathname.startsWith("/admin")
	);
}

export function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (isPublicPath(pathname)) return NextResponse.next();

	// At this point, it's an /admin/* route (excluding /admin/login)
	const token = req.cookies.get(SESSION_COOKIE)?.value;
	if (!token) {
		return NextResponse.redirect(new URL("/admin/login", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
