import { handleSmartWaiverWebhook } from "@/lib/smartwaiver-webhook";

export async function POST(request: Request) {
	return handleSmartWaiverWebhook(request, "boating");
}
