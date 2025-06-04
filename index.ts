import "dotenv/config";
import { runAgent } from "./src/agent.js";
import { toolSchemas } from "./src/tools.js";

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

console.log(
	"🤖 AI Agent ready. Type your message and press Enter (type 'exit' to quit)",
);

// 🔁 Main loop
while (true) {
	const userMessage = await rl.question("You: ");

	if (userMessage.toLowerCase() === "exit") {
		console.log("👋 Goodbye!");
		break;
	}

	const response = await runAgent({
		userMessage,
		tools: toolSchemas,
	});

	console.log(`AI: ${response}\n`);
}

await rl.close();
