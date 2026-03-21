"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
	title: string;
	onConfirm: () => void | Promise<void>;
}

export function DeleteDialog({ title, onConfirm }: DeleteDialogProps) {
	const [open, setOpen] = useState(false);
	const [pending, setPending] = useState(false);

	const handleConfirm = async () => {
		setPending(true);
		await onConfirm();
		setPending(false);
		setOpen(false);
	};

	if (!open) {
		return (
			<Button
				variant="ghost"
				size="sm"
				onClick={() => setOpen(true)}
				className="text-rust hover:text-rust"
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm text-muted-foreground">Delete {title}?</span>
			<Button
				size="sm"
				variant="destructive"
				onClick={handleConfirm}
				disabled={pending}
				className="bg-rust text-cream hover:bg-rust-light"
			>
				{pending ? "..." : "Yes"}
			</Button>
			<Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
				No
			</Button>
		</div>
	);
}
