"use client";

import { X } from "lucide-react";
import { RoleBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { addClientRoleAction, removeClientRoleAction } from "@/lib/actions/clients";

const allRoles = ["volunteer", "participant", "member", "donor"] as const;

interface RoleManagerProps {
	clientId: string;
	currentRoles: string[];
}

export function RoleManager({ clientId, currentRoles }: RoleManagerProps) {
	const availableRoles = allRoles.filter((r) => !currentRoles.includes(r));

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-2">
				{currentRoles.length === 0 && (
					<span className="text-sm text-muted-foreground">No roles assigned</span>
				)}
				{currentRoles.map((role) => (
					<div key={role} className="flex items-center gap-1">
						<RoleBadge role={role} />
						<form
							action={async () => {
								await removeClientRoleAction(clientId, role);
							}}
						>
							<button
								type="submit"
								className="rounded-sm p-0.5 text-muted-foreground hover:text-rust"
								aria-label={`Remove ${role} role`}
							>
								<X className="h-3 w-3" />
							</button>
						</form>
					</div>
				))}
			</div>

			{availableRoles.length > 0 && (
				<form
					action={async (formData: FormData) => {
						await addClientRoleAction(clientId, formData);
					}}
					className="flex items-center gap-2"
				>
					<select
						name="role"
						className="rounded-sm border border-input bg-background px-3 py-1.5 text-sm"
					>
						{availableRoles.map((r) => (
							<option key={r} value={r}>
								{r}
							</option>
						))}
					</select>
					<Button
						type="submit"
						size="sm"
						className="bg-rust font-heading text-xs uppercase text-cream hover:bg-rust-light"
					>
						Add Role
					</Button>
				</form>
			)}
		</div>
	);
}
