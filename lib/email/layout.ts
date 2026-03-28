/** Wrap email body content in the shared MBV brand layout. */
export function emailLayout(options: {
	body: string;
	disclaimer: string;
	maxWidth?: number;
	showSignature?: boolean;
}): string {
	const { body, disclaimer, maxWidth = 520, showSignature = true } = options;

	return `
		<div style="font-family: sans-serif; max-width: ${maxWidth}px; margin: 0 auto; color: #1a202c;">
			<h1 style="color: #1a365d; font-size: 24px; margin-bottom: 4px;">Monterey Bay Veterans</h1>
			<hr style="border: none; border-top: 2px solid #c0392b; margin: 16px 0;" />

			${body}

			${showSignature ? '<p style="margin-top: 24px;">— The Monterey Bay Veterans Team</p>' : ""}

			<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
			<p style="color: #a0aec0; font-size: 12px;">${disclaimer}</p>
		</div>`;
}
