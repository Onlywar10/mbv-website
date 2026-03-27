"use client";

import { upload } from "@vercel/blob/client";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
	name: string;
	label: string;
	currentUrl?: string;
}

export function ImageUpload({ name, label, currentUrl }: ImageUploadProps) {
	const [url, setUrl] = useState(currentUrl ?? "");
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		setError("");

		try {
			const blob = await upload(file.name, file, {
				access: "public",
				handleUploadUrl: "/api/upload",
			});
			setUrl(blob.url);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setUploading(false);
		}
	}

	function handleRemove() {
		setUrl("");
		setError("");
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	}

	return (
		<div className="space-y-2">
			<Label className="font-heading text-xs uppercase tracking-wider">{label}</Label>

			<input type="hidden" name={name} value={url} />

			{url ? (
				<div className="relative overflow-hidden rounded-sm ring-1 ring-border">
					<div className="relative aspect-[16/10]">
						<Image
							src={url}
							alt="Upload preview"
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</div>
					<div className="absolute top-2 right-2 flex gap-1">
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={() => inputRef.current?.click()}
							className="bg-white/90 text-xs backdrop-blur-sm"
						>
							Change
						</Button>
						<Button
							type="button"
							size="icon-sm"
							variant="outline"
							onClick={handleRemove}
							className="bg-white/90 backdrop-blur-sm"
						>
							<X className="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>
			) : (
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					disabled={uploading}
					className="flex w-full flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-sm text-muted-foreground transition-colors hover:border-rust/30 hover:bg-muted/50"
				>
					{uploading ? (
						<>
							<span className="h-6 w-6 animate-spin rounded-full border-2 border-rust border-t-transparent" />
							<span>Uploading...</span>
						</>
					) : (
						<>
							<ImagePlus className="h-8 w-8 text-muted-foreground/50" />
							<span>Click to upload an image</span>
							<span className="text-xs text-muted-foreground/60">
								JPEG, PNG, WebP, or GIF (max 10MB)
							</span>
						</>
					)}
				</button>
			)}

			{error && <p className="text-xs text-destructive">{error}</p>}

			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp,image/gif"
				onChange={handleFileChange}
				className="hidden"
			/>
		</div>
	);
}
