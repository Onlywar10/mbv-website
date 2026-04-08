"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveEventAsTemplateAction } from "@/lib/actions/events";

interface SaveTemplateButtonProps {
	eventId: string;
	eventTitle: string;
}

export function SaveTemplateButton({ eventId, eventTitle }: SaveTemplateButtonProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [isPending, setIsPending] = useState(false);
	const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

	async function handleSave() {
		setIsPending(true);
		setMessage(null);
		const result = await saveEventAsTemplateAction(eventId, name);
		setIsPending(false);

		if (result.error) {
			setMessage({ type: "error", text: result.error });
		} else {
			setMessage({ type: "success", text: result.success ?? "Saved" });
			setTimeout(() => setOpen(false), 1000);
		}
	}

	return (
		<>
			<Button
				variant="outline"
				onClick={() => {
					setName(eventTitle);
					setMessage(null);
					setOpen(true);
				}}
				className="inline-flex items-center gap-2 rounded-sm font-heading text-sm uppercase tracking-wider"
			>
				<FileText className="h-4 w-4" />
				Save as Template
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Save as Template</DialogTitle>
						<DialogDescription>
							Save this event&apos;s settings as a reusable template for creating future events.
						</DialogDescription>
					</DialogHeader>

					{message && (
						<div
							className={`rounded-sm px-3 py-2 text-sm ${
								message.type === "error" ? "bg-rust/10 text-rust" : "bg-green-500/10 text-green-700"
							}`}
						>
							{message.text}
						</div>
					)}

					<div className="space-y-2">
						<Label
							htmlFor="template-name"
							className="font-heading text-xs uppercase tracking-wider"
						>
							Template Name
						</Label>
						<Input
							id="template-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Monthly Fishing Trip"
						/>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={isPending || !name.trim()}
							className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
						>
							{isPending ? "Saving..." : "Save Template"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
