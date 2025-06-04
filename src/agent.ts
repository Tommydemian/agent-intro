// import { addMessages, getMessages } from "./memory.js";
// import { runLLM } from "./llm.js";
// import { toolFunctions } from "./tools.js";
// import type { AIMessage } from "../types.js";

// export const runAgent = async ({
// 	userMessage,
// 	tools,
// }: {
// 	userMessage: string;
// 	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// 	tools: any[];
// }) => {
// 	await addMessages([{ role: "user", content: userMessage }]);

// 	const history = await getMessages();
// 	const response = await runLLM({ messages: history, tools });

// 	const toolMessages: AIMessage[] = [];

// 	if (response.tool_calls) {
// 		// if model decides to execute a fx
// 		for (const toolCall of response.tool_calls) {
// 			// I search the fx in the Array of available tools/fx
// 			const fn = toolFunctions[toolCall.function.name];
// 			if (!fn) continue;

// 			const args = JSON.parse(toolCall.function.arguments || "{}");
// 			const result = await fn(args);

// 			// send message type tool
// 			toolMessages.push({
// 				role: "tool",
// 				tool_call_id: toolCall.id,
// 				content: result,
// 			});
// 		}
// 	}

// 	let finalMessage = response;

// 	// I send the final message
// 	if (toolMessages.length > 0) {
// 		finalMessage = await runLLM({
// 			messages: [...history, response, ...toolMessages],
// 			tools,
// 		});
// 	}

// 	await addMessages([finalMessage]);
// 	return finalMessage.content;
// };
import { addMessages, getMessages } from "./memory.js";
import { runLLM } from "./llm.js";
import { toolFunctions } from "./tools.js";
import type { AIMessage } from "../types.js";

export const runAgent = async ({
	userMessage,
	tools,
}: {
	userMessage: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	tools: any[];
}) => {
	console.group("🧠 AGENT CYCLE");

	console.log("📝 User:", userMessage);
	await addMessages([{ role: "user", content: userMessage }]);

	const history = await getMessages();
	const response = await runLLM({ messages: history, tools });

	console.log("🤖 GPT response:");
	console.dir(response, { depth: null });

	const toolMessages: AIMessage[] = [];

	if (response.tool_calls) {
		console.group("🧩 Tool Calls");

		for (const toolCall of response.tool_calls) {
			const name = toolCall.function.name;
			const fn = toolFunctions[name];
			if (!fn) {
				console.warn(`⚠️ Tool not implemented: ${name}`);
				continue;
			}

			const args = JSON.parse(toolCall.function.arguments || "{}");
			console.log(`🔧 Executing ${name} with:`, args);

			const result = await fn(args);
			console.log(`✅ Result from ${name}:`, result);

			toolMessages.push({
				role: "tool",
				tool_call_id: toolCall.id,
				content: result,
			});
		}

		console.groupEnd(); // 🧩 Tool Calls
	}

	let finalMessage = response;

	if (toolMessages.length > 0) {
		console.log("🔁 Sending tool results back to GPT...");

		finalMessage = await runLLM({
			messages: [...history, response, ...toolMessages],
			tools,
		});

		console.log("💬 Final GPT response:", finalMessage.content);
	}

	await addMessages([finalMessage]);

	console.groupEnd(); // 🧠 AGENT CYCLE
	return finalMessage.content;
};
