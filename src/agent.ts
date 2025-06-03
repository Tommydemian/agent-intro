import { addMessages, getMessages } from "./memory.js";
import { runLLM } from "./llm.js";
import type { AIMessage } from "../types.js";

type ToolFunctionMap = {
	get_weather: () => string;
};

const toolFunctions: ToolFunctionMap = {
	get_weather: () => "It's hot, 89°F in Buenos Aires.",
};

export const runAgent = async ({
	userMessage,
	tools,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: { userMessage: string; tools: any[] }) => {
	await addMessages([{ role: "user", content: userMessage }]);

	// loader start
	const history = await getMessages();
	const response = await runLLM({ messages: history, tools });

	if (response.tool_calls) {
		const toolMessages: AIMessage[] = [];

		for (const toolCall of response.tool_calls) {
			const toolName = toolCall.function.name as keyof ToolFunctionMap;
			const fn = toolFunctions[toolName];

			if (fn) {
				const result = fn();

				toolMessages.push({
					role: "tool",
					tool_call_id: toolCall.id,
					content: result,
				});
			}
		}

		let finalMessage = response;

		if (toolMessages.length > 0) {
			finalMessage = await runLLM({
				messages: [...history, response, ...toolMessages],
				tools,
			});
		}

		await addMessages([finalMessage]);
		return finalMessage.content;
	}
};
