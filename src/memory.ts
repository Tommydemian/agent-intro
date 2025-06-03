import { getDB } from "../lib/db/index.js";
import type { AIMessage, MessageWithMetadata } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export const addMetadata = (message: AIMessage): MessageWithMetadata => ({
	...message,
	id: uuidv4(),
	createdAt: new Date().toISOString(),
});

export const removeMetadata = (message: MessageWithMetadata) => {
	const { createdAt, id, ...rest } = message;
	return rest;
};

export const addMessages = async (messages: AIMessage[]) => {
	const db = await getDB();
	const withMetadata = messages.map(addMetadata);
	db.data?.messages.push(...withMetadata);
	await db.write();
};
export const getMessages = async () => {
	const db = await getDB();
	return db.data?.messages ?? []; // if (undefined) return []
};
