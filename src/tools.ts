import type {
	ChatCompletionMessage,
	ChatCompletionTool,
} from "openai/resources/chat/completions";
import type { AIMessage } from "../types.js";
import { addMessages, getMessages } from "./memory.js";
import { runLLM } from "./llm.js";

// === Tool schema (for OpenAI to understand) ===
export const toolSchemas: ChatCompletionTool[] = [
	{
		type: "function",
		function: {
			name: "get_weather",
			description: "Returns the current weather for a given location",
			parameters: {
				type: "object",
				properties: {
					location: {
						type: "string",
						description: "The city and country, e.g. Paris, France",
					},
					unit: {
						type: "string",
						enum: ["c", "f"],
						description:
							"The temperature unit: c for Celsius, f for Fahrenheit",
					},
				},
				required: ["location", "unit"],
			},
		},
	},
];

// === Runtime tool function implementations ===
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ToolFunctionArgs = Record<string, any>;

export const toolFunctions: Record<
	string,
	(args: ToolFunctionArgs) => Promise<string> | string
> = {
	get_weather: ({ location, unit }) => {
		const fakeWeather = `It's 22°${unit.toUpperCase()} in ${location}.`;
		return fakeWeather;
	},
};

export const toolRunner = async ({
	userMessage,
	tools,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: { userMessage: string; tools: any[] }) => {
	// 1. Save user input
	await addMessages([{ role: "user", content: userMessage }]);

	let finalMessage: AIMessage;

	// 2. Start loop until we get a final assistant message
	while (true) {
		const history = await getMessages();
		const response = await runLLM({ messages: history, tools });

		// 🔚 If GPT gave us a full answer, break the loop
		if (response.content) {
			finalMessage = response;
			break;
		}

		// 🧰 Otherwise, execute the tool(s)
		const toolMessages: AIMessage[] = [];

		if (response.tool_calls) {
			// FX EXECUTION
			for (const toolCall of response.tool_calls) {
				const name = toolCall.function.name;
				const fn = toolFunctions[name];
				if (!fn) {
					console.warn(`⚠️ Tool not implemented: ${name}`);
					continue; // why continue?
				}

				const args = JSON.parse(toolCall.function.arguments || "{}");
				console.log(`🔧 Executing ${name} with:`, args); // if no args fn({})

				const result = await fn(args);
				console.log(`✅ Result from ${name}:`, result);

				// THERE'S A MESSAGE TO PUSH
				toolMessages.push({
					role: "tool",
					content: result,
					tool_call_id: toolCall.id,
				});
			}
		}

		// 🧠 Send tool results back to GPT and loop again
		if (toolMessages.length > 0) {
			await addMessages([response, ...toolMessages]);
		}
	}

	await addMessages([finalMessage]);
	return finalMessage.content;
};
