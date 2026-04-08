"use client";

import { upload } from "@vercel/blob/client";
import { Eye, EyeOff, ImagePlus, Paperclip, Send, X } from "lucide-react";
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

interface EmbeddedImage {
	url: string;
	name: string;
}

function bodyToHtml(body: string, images: EmbeddedImage[]): string {
	const paragraphs = body
		.split("\n\n")
		.map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
		.join("");

	const imageHtml = images
		.map(
			(img) =>
				`<div style="margin: 16px 0;"><img src="${img.url}" alt="${img.name}" style="max-width: 100%; height: auto; border-radius: 4px;" /></div>`,
		)
		.join("");

	return paragraphs + imageHtml;
}

function buildPreviewHtml(subject: string, body: string, images: EmbeddedImage[]): string {
	const content = `<p>Hi [First Name],</p>${bodyToHtml(body, images)}`;

	return `
		<div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a202c;">
			<h1 style="color: #1a365d; font-size: 24px; margin-bottom: 4px;">Monterey Bay Veterans</h1>
			<hr style="border: none; border-top: 2px solid #c0392b; margin: 16px 0;" />
			${content}
			<p style="margin-top: 24px;">— The Monterey Bay Veterans Team</p>
			<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
			<p style="color: #a0aec0; font-size: 12px;">You received this email because you opted in to communications from Monterey Bay Veterans. <a href="#" style="color: #c0392b;">Unsubscribe</a></p>
		</div>`;
}

export function ComposeForm({ recipientCount }: ComposeFormProps) {
	const [state, formAction, isPending] = useActionState<ActionState, FormData>(
		sendMailingListBlastAction,
		{},
	);
	const [subject, setSubject] = useState("");
	const [body, setBody] = useState("");
	const [attachments, setAttachments] = useState<Attachment[]>([]);
	const [images, setImages] = useState<EmbeddedImage[]>([]);
	const [uploading, setUploading] = useState(false);
	const [uploadingImage, setUploadingImage] = useState(false);
	const [uploadError, setUploadError] = useState("");
	const [confirming, setConfirming] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);
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

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploadingImage(true);
		setUploadError("");

		try {
			const blob = await upload(file.name, file, {
				access: "public",
				handleUploadUrl: "/api/upload",
			});
			setImages((prev) => [...prev, { url: blob.url, name: file.name }]);
		} catch (err) {
			setUploadError(err instanceof Error ? err.message : "Image upload failed");
		} finally {
			setUploadingImage(false);
			if (imageInputRef.current) imageInputRef.current.value = "";
		}
	}

	function removeAttachment(index: number) {
		setAttachments((prev) => prev.filter((_, i) => i !== index));
	}

	function removeImage(index: number) {
		setImages((prev) => prev.filter((_, i) => i !== index));
	}

	function handleSendClick() {
		setConfirming(true);
	}

	function handleConfirmSend() {
		setConfirming(false);
		formRef.current?.requestSubmit();
	}

	return (
		<div className="space-y-6">
			<form ref={formRef} action={formAction} className="space-y-6">
				{state.error && (
					<div className="rounded-sm bg-rust/10 px-4 py-3 text-sm text-rust">{state.error}</div>
				)}
				{state.success && (
					<div className="rounded-sm bg-green-500/10 px-4 py-3 text-sm text-green-700">
						{state.success}
					</div>
				)}

				{/* Hidden fields */}
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
				<input type="hidden" name="imageUrls" value={images.map((img) => img.url).join(",")} />
				<input type="hidden" name="imageNames" value={images.map((img) => img.name).join(",")} />

				{/* Subject */}
				<div className="space-y-2">
					<Label htmlFor="subject" className="font-heading text-xs uppercase tracking-wider">
						Subject
					</Label>
					<Input
						id="subject"
						name="subject"
						placeholder="e.g., April Newsletter, Upcoming Events"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
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
						value={body}
						onChange={(e) => setBody(e.target.value)}
						required
					/>
					<p className="text-xs text-muted-foreground">
						Plain text — blank lines create paragraph breaks. The email will be wrapped in the MBV
						brand template automatically.
					</p>
				</div>

				{/* Embedded Images */}
				<div className="space-y-2">
					<Label className="font-heading text-xs uppercase tracking-wider">Embedded Images</Label>
					<p className="text-xs text-muted-foreground">
						These images will be displayed inline in the email body, below the message text.
					</p>

					{images.length > 0 && (
						<div className="grid gap-3 sm:grid-cols-2">
							{images.map((img, i) => (
								<div
									key={img.url}
									className="group relative overflow-hidden rounded-sm ring-1 ring-border"
								>
									<img
										src={img.url}
										alt={img.name}
										className="aspect-[16/10] w-full object-cover"
									/>
									<div className="absolute top-2 right-2">
										<Button
											type="button"
											size="sm"
											variant="outline"
											onClick={() => removeImage(i)}
											className="bg-white/90 backdrop-blur-sm"
										>
											<X className="h-3.5 w-3.5" />
										</Button>
									</div>
									<div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
										{img.name}
									</div>
								</div>
							))}
						</div>
					)}

					<button
						type="button"
						onClick={() => imageInputRef.current?.click()}
						disabled={uploadingImage}
						className="flex w-full items-center justify-center gap-2 rounded-sm border-2 border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-rust/30 hover:bg-muted/50"
					>
						{uploadingImage ? (
							<>
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-rust border-t-transparent" />
								Uploading...
							</>
						) : (
							<>
								<ImagePlus className="h-4 w-4" />
								Add image to email body (JPEG, PNG, WebP)
							</>
						)}
					</button>

					<input
						ref={imageInputRef}
						type="file"
						accept="image/jpeg,image/png,image/webp,image/gif"
						onChange={handleImageUpload}
						className="hidden"
					/>
				</div>

				{/* Attachments */}
				<div className="space-y-2">
					<Label className="font-heading text-xs uppercase tracking-wider">Attachments</Label>

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

					{uploadError && <p className="text-xs text-destructive">{uploadError}</p>}

					<input
						ref={fileInputRef}
						type="file"
						accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={() => setShowPreview(!showPreview)}
						className="gap-2"
					>
						{showPreview ? (
							<>
								<EyeOff className="h-4 w-4" />
								Hide Preview
							</>
						) : (
							<>
								<Eye className="h-4 w-4" />
								Preview Email
							</>
						)}
					</Button>

					{confirming ? (
						<div className="flex flex-1 items-center gap-3 rounded-sm border border-ochre/30 bg-ochre/10 px-4 py-3">
							<p className="flex-1 text-sm text-foreground">
								Send to <strong>{recipientCount}</strong> recipient{recipientCount !== 1 ? "s" : ""}
								?
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
				</div>
			</form>

			{/* Email Preview */}
			{showPreview && (
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<h3 className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
							Email Preview
						</h3>
						<span className="rounded-sm bg-muted px-2 py-0.5 text-xs text-muted-foreground">
							Subject: {subject || "(no subject)"}
						</span>
					</div>
					<div className="overflow-hidden rounded-sm border border-border bg-white p-6 shadow-sharp">
						<div
							dangerouslySetInnerHTML={{
								__html: buildPreviewHtml(subject, body || "(no message)", images),
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
