import "dotenv/config";
// import { runLLM } from "./src/llm.js";
import { runAgent } from "./src/agent.js";
import { addMessages, getMessages } from "./src/memory.js";

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

console.log(
	"🤖 AI Agent ready. Type your message and press Enter (type 'exit' to quit)",
);

const weatherTool = {
	type: "function",
	function: {
		name: "get_weather",
		description: "Returns the current weather",
		parameters: {
			type: "object",
			properties: {},
		},
	},
};

while (true) {
	// current prompt message
	const userMessage = await rl.question("You: ");
	// save message
	// await addMessages([{ role: "user", content: userMessage }]);
	// // get messages
	// const messages = await getMessages();

	const response = await runAgent({ userMessage, tools: [weatherTool] });

	// if (userMessage.toLowerCase() === "exit") {
	// 	console.log("👋 Goodbye!");
	// 	break;
	// }

	// const response = await runAgent({
	// 	messages,
	// });
	console.log(`AI: ${response}\n`);

	// await addMessages([{ role: "assistant", content: response }]);
}
