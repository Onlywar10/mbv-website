"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { clientRoles } from "@/lib/db/schema/client-roles";
import { clients } from "@/lib/db/schema/clients";
import type { ActionState } from "@/lib/types";
import { clientRoleSchema, clientSchema } from "@/lib/validations/clients";

export async function createClientAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const parsed = clientSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const data = parsed.data;

	// Check for duplicate email
	const existing = await db
		.select({ id: clients.id })
		.from(clients)
		.where(eq(clients.email, data.email.toLowerCase()));
	if (existing.length > 0) {
		return { error: "A client with this email already exists" };
	}

	await db.insert(clients).values({
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email.toLowerCase(),
		phone: data.phone || null,
		address: data.address || null,
		city: data.city || null,
		state: data.state || null,
		zip: data.zip || null,
		notes: data.notes || null,
		isActive: data.isActive ?? true,
		emailOptIn: data.emailOptIn ?? true,
	});

	revalidatePath("/admin/clients");

	return { success: "Client created successfully" };
}

export async function updateClientAction(
	id: string,
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const parsed = clientSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const data = parsed.data;

	// Check email uniqueness (excluding current client)
	const existing = await db
		.select({ id: clients.id })
		.from(clients)
		.where(eq(clients.email, data.email.toLowerCase()));
	if (existing.length > 0 && existing[0].id !== id) {
		return { error: "A client with this email already exists" };
	}

	await db
		.update(clients)
		.set({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email.toLowerCase(),
			phone: data.phone || null,
			address: data.address || null,
			city: data.city || null,
			state: data.state || null,
			zip: data.zip || null,
			notes: data.notes || null,
			isActive: data.isActive ?? true,
			emailOptIn: data.emailOptIn ?? true,
			updatedAt: new Date(),
		})
		.where(eq(clients.id, id));

	revalidatePath("/admin/clients");
	revalidatePath(`/admin/clients/${id}`);

	return { success: "Client updated successfully" };
}

export async function addClientRoleAction(
	clientId: string,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const parsed = clientRoleSchema.safeParse({ role: formData.get("role") });
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	// Check if role already assigned
	const existing = await db
		.select()
		.from(clientRoles)
		.where(and(eq(clientRoles.clientId, clientId), eq(clientRoles.role, parsed.data.role)));
	if (existing.length > 0) {
		return { error: "Role already assigned" };
	}

	await db.insert(clientRoles).values({
		clientId,
		role: parsed.data.role,
	});

	revalidatePath(`/admin/clients/${clientId}`);
	revalidatePath("/admin/clients");

	return { success: `${parsed.data.role} role added` };
}

export async function removeClientRoleAction(clientId: string, role: string): Promise<ActionState> {
	await requireAuth();

	await db
		.delete(clientRoles)
		.where(
			and(
				eq(clientRoles.clientId, clientId),
				eq(clientRoles.role, role as "volunteer" | "participant" | "member" | "donor"),
			),
		);

	revalidatePath(`/admin/clients/${clientId}`);
	revalidatePath("/admin/clients");

	return { success: `${role} role removed` };
}
