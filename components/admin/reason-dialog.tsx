"use client";

import { cloneElement, isValidElement, type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ReasonDialogProps {
	title: string;
	description: string;
	confirmLabel: string;
	pendingLabel: string;
	placeholder?: string;
	trigger: ReactNode;
	onConfirm: (reason?: string) => Promise<void>;
}

export function ReasonDialog({
	title,
	description,
	confirmLabel,
	pendingLabel,
	placeholder = "Provide a reason...",
	trigger,
	onConfirm,
}: ReasonDialogProps) {
	const [open, setOpen] = useState(false);
	const [reason, setReason] = useState("");
	const [pending, setPending] = useState(false);

	const handleConfirm = async () => {
		setPending(true);
		await onConfirm(reason || undefined);
		setPending(false);
		setOpen(false);
		setReason("");
	};

	const triggerElement = isValidElement<{ onClick?: () => void }>(trigger)
		? cloneElement(trigger, { onClick: () => setOpen(true) })
		: trigger;

	return (
		<>
			{triggerElement}
			<Dialog
				open={open}
				onOpenChange={(v) => {
					if (!v) setReason("");
					setOpen(v);
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>

					<div className="space-y-2">
						<label htmlFor="reason-input" className="font-heading text-xs uppercase tracking-wider">
							Reason (optional)
						</label>
						<Textarea
							id="reason-input"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder={placeholder}
							rows={3}
						/>
						<p className="text-xs text-muted-foreground">
							If provided, this will be included in the notification email.
						</p>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setOpen(false);
								setReason("");
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirm}
							disabled={pending}
							className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
						>
							{pending ? pendingLabel : confirmLabel}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
