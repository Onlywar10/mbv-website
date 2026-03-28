import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, validateSession } from "@/lib/auth/session";

export async function POST(request: NextRequest): Promise<Response> {
	const body = (await request.json()) as HandleUploadBody;

	const jsonResponse = await handleUpload({
		body,
		request,
		onBeforeGenerateToken: async () => {
			const cookieStore = await cookies();
			const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

			if (!token) {
				throw new Error("Not authenticated");
			}

			const user = await validateSession(token);
			if (!user) {
				throw new Error("Invalid session");
			}

			return {
				allowedContentTypes: [
					"image/jpeg",
					"image/png",
					"image/webp",
					"image/gif",
					"application/pdf",
					"application/msword",
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				],
				maximumSizeInBytes: 10 * 1024 * 1024,
				addRandomSuffix: true,
			};
		},
		onUploadCompleted: async () => {},
	});

	return Response.json(jsonResponse);
}
