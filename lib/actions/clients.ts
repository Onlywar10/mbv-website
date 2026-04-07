"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { clientRoles } from "@/lib/db/schema/client-roles";
import { clients } from "@/lib/db/schema/clients";
import { donations } from "@/lib/db/schema/donations";
import { logger } from "@/lib/logger";
import type { ActionState } from "@/lib/types";
import { clientRoleSchema, clientSchema, donationSchema } from "@/lib/validations/clients";

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

	try {
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
	} catch (err) {
		logger.error("clients", "Failed to create client", { email: data.email, error: String(err) });
		return { error: "Failed to create client. Please try again." };
	}

	logger.info("clients", "Client created", {
		email: data.email,
		name: `${data.firstName} ${data.lastName}`,
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

	try {
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
	} catch (err) {
		logger.error("clients", "Failed to update client", { id, error: String(err) });
		return { error: "Failed to update client. Please try again." };
	}

	logger.info("clients", "Client updated", { id, email: data.email });
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

	try {
		await db.insert(clientRoles).values({
			clientId,
			role: parsed.data.role,
		});
	} catch (err) {
		logger.error("clients", "Failed to add client role", {
			clientId,
			role: parsed.data.role,
			error: String(err),
		});
		return { error: "Failed to add role. Please try again." };
	}

	logger.info("clients", "Client role added", { clientId, role: parsed.data.role });
	revalidatePath(`/admin/clients/${clientId}`);
	revalidatePath("/admin/clients");

	return { success: `${parsed.data.role} role added` };
}

export async function removeClientRoleAction(clientId: string, role: string): Promise<ActionState> {
	await requireAuth();

	try {
		await db
			.delete(clientRoles)
			.where(
				and(
					eq(clientRoles.clientId, clientId),
					eq(clientRoles.role, role as "volunteer" | "participant" | "member" | "donor"),
				),
			);
	} catch (err) {
		logger.error("clients", "Failed to remove client role", { clientId, role, error: String(err) });
		return { error: "Failed to remove role. Please try again." };
	}

	logger.info("clients", "Client role removed", { clientId, role });
	revalidatePath(`/admin/clients/${clientId}`);
	revalidatePath("/admin/clients");

	return { success: `${role} role removed` };
}

// -- Donations ----------------------------------------------

export async function createDonationAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const parsed = donationSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const data = parsed.data;

	try {
		await db.insert(donations).values({
			clientId: data.clientId || null,
			amount: data.amount.toFixed(2),
			paymentMethod: data.paymentMethod,
			donatedAt: new Date(data.donatedAt),
			transactionId: data.transactionId || null,
			notes: data.notes || null,
		});
	} catch (err) {
		logger.error("donations", "Failed to create donation", {
			clientId: data.clientId,
			amount: data.amount,
			error: String(err),
		});
		return { error: "Failed to record donation. Please try again." };
	}

	logger.info("donations", "Donation created", {
		clientId: data.clientId,
		amount: data.amount,
		paymentMethod: data.paymentMethod,
	});
	revalidatePath("/admin/donations");
	if (data.clientId) {
		revalidatePath(`/admin/clients/${data.clientId}`);
	}

	return { success: "Donation recorded" };
}

export async function deleteClientAction(id: string): Promise<ActionState> {
	await requireAuth();

	try {
		await db.delete(clients).where(eq(clients.id, id));
	} catch (err) {
		logger.error("clients", "Failed to delete client", { id, error: String(err) });
		return { error: "Failed to delete client. Please try again." };
	}

	logger.info("clients", "Client deleted", { id });
	revalidatePath("/admin/clients");

	return { success: "Client deleted" };
}

export async function deleteClientsAction(ids: string[]): Promise<ActionState> {
	await requireAuth();

	if (ids.length === 0) {
		return { error: "No clients selected" };
	}

	try {
		await db.delete(clients).where(inArray(clients.id, ids));
	} catch (err) {
		logger.error("clients", "Failed to delete clients", { count: ids.length, error: String(err) });
		return { error: "Failed to delete clients. Please try again." };
	}

	logger.info("clients", "Clients bulk deleted", { count: ids.length });
	revalidatePath("/admin/clients");

	return { success: `${ids.length} client${ids.length !== 1 ? "s" : ""} deleted` };
}

export async function deleteDonationAction(id: string): Promise<ActionState> {
	await requireAuth();

	try {
		await db.delete(donations).where(eq(donations.id, id));
	} catch (err) {
		logger.error("donations", "Failed to delete donation", { id, error: String(err) });
		return { error: "Failed to delete donation. Please try again." };
	}

	logger.info("donations", "Donation deleted", { id });
	revalidatePath("/admin/donations");

	return { success: "Donation removed" };
}
