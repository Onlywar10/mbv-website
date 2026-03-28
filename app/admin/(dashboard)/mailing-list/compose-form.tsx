"use client";

import { upload } from "@vercel/blob/client";
import { Paperclip, Send, X } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendMailingListBlastAction } from "@/lib/actions/mailing-list";
import type { ActionState } from "@/lib/types";

interface ComposeFormProps {
	recipientCount: number;
}

interface Attachment {
	url: string;
	name: string;
}

export function ComposeForm({ recipientCount }: ComposeFormProps) {
	const [state, formAction, isPending] = useActionState<ActionState, FormData>(
		sendMailingListBlastAction,
		{},
	);
	const [attachments, setAttachments] = useState<Attachment[]>([]);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState("");
	const [confirming, setConfirming] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		setUploadError("");

		try {
			const blob = await upload(file.name, file, {
				access: "public",
				handleUploadUrl: "/api/upload",
			});
			setAttachments((prev) => [...prev, { url: blob.url, name: file.name }]);
		} catch (err) {
			setUploadError(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	}

	function removeAttachment(index: number) {
		setAttachments((prev) => prev.filter((_, i) => i !== index));
	}

	function handleSendClick() {
		setConfirming(true);
	}

	function handleConfirmSend() {
		setConfirming(false);
		formRef.current?.requestSubmit();
	}

	return (
		<form ref={formRef} action={formAction} className="space-y-6">
			{state.error && (
				<div className="rounded-sm bg-rust/10 px-4 py-3 text-sm text-rust">
					{state.error}
				</div>
			)}
			{state.success && (
				<div className="rounded-sm bg-green-500/10 px-4 py-3 text-sm text-green-700">
					{state.success}
				</div>
			)}

			{/* Hidden fields for attachments */}
			<input
				type="hidden"
				name="attachmentUrls"
				value={attachments.map((a) => a.url).join(",")}
			/>
			<input
				type="hidden"
				name="attachmentNames"
				value={attachments.map((a) => a.name).join(",")}
			/>

			{/* Subject */}
			<div className="space-y-2">
				<Label htmlFor="subject" className="font-heading text-xs uppercase tracking-wider">
					Subject
				</Label>
				<Input
					id="subject"
					name="subject"
					placeholder="e.g., April Newsletter, Upcoming Events"
					required
				/>
			</div>

			{/* Body */}
			<div className="space-y-2">
				<Label htmlFor="body" className="font-heading text-xs uppercase tracking-wider">
					Message
				</Label>
				<Textarea
					id="body"
					name="body"
					placeholder="Write your message here. Separate paragraphs with blank lines."
					rows={12}
					required
				/>
				<p className="text-xs text-muted-foreground">
					Plain text — blank lines create paragraph breaks. The email will be wrapped in the
					MBV brand template automatically.
				</p>
			</div>

			{/* Attachments */}
			<div className="space-y-2">
				<Label className="font-heading text-xs uppercase tracking-wider">
					Attachments
				</Label>

				{attachments.length > 0 && (
					<div className="space-y-2">
						{attachments.map((a, i) => (
							<div
								key={a.url}
								className="flex items-center justify-between rounded-sm border border-border px-3 py-2 text-sm"
							>
								<span className="flex items-center gap-2 truncate">
									<Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
									{a.name}
								</span>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => removeAttachment(i)}
								>
									<X className="h-3.5 w-3.5" />
								</Button>
							</div>
						))}
					</div>
				)}

				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					disabled={uploading}
					className="flex w-full items-center justify-center gap-2 rounded-sm border-2 border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-rust/30 hover:bg-muted/50"
				>
					{uploading ? (
						<>
							<span className="h-4 w-4 animate-spin rounded-full border-2 border-rust border-t-transparent" />
							Uploading...
						</>
					) : (
						<>
							<Paperclip className="h-4 w-4" />
							Add attachment (PDF, DOC, images — max 10MB)
						</>
					)}
				</button>

				{uploadError && (
					<p className="text-xs text-destructive">{uploadError}</p>
				)}

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					onChange={handleFileChange}
					className="hidden"
				/>
			</div>

			{/* Send */}
			{confirming ? (
				<div className="flex items-center gap-3 rounded-sm border border-ochre/30 bg-ochre/10 px-4 py-3">
					<p className="flex-1 text-sm text-foreground">
						Send this email to <strong>{recipientCount}</strong> recipient{recipientCount !== 1 ? "s" : ""}?
					</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setConfirming(false)}
					>
						Cancel
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={handleConfirmSend}
						disabled={isPending}
						className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
					>
						{isPending ? "Sending..." : "Confirm Send"}
					</Button>
				</div>
			) : (
				<Button
					type="button"
					size="lg"
					onClick={handleSendClick}
					disabled={isPending || recipientCount === 0}
					className="gap-2 bg-rust font-heading uppercase text-cream hover:bg-rust-light"
				>
					<Send className="h-4 w-4" />
					Send to {recipientCount} Recipient{recipientCount !== 1 ? "s" : ""}
				</Button>
			)}
		</form>
	);
}
