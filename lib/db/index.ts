import { JSONFile, Low } from "lowdb";
import type { Data } from "../../types.js";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const defaultData: Data = { messages: [] };

export const getDB = async () => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const file = join(__dirname, "db.json");

	const adapter = new JSONFile<Data>(file);
	const db = new Low<Data>(adapter);
	await db.read();
	db.data ||= defaultData;
	return db;
};
