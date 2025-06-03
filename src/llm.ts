import { client } from "./ai.js";
import type { AIMessage } from "../types.js";
import type {
	ChatCompletionTool,
	ChatCompletionMessage,
} from "openai/resources/chat/completions";

type RunLLMConfig = {
	messages: AIMessage[];
	tools?: ChatCompletionTool[];
};

export const runLLM = async ({
	messages,
	tools,
}: RunLLMConfig): Promise<ChatCompletionMessage> => {
	const response = await client.chat.completions.create({
		model: "gpt-4o-mini",
		temperature: 0.1, // randomness
		messages,
		tool_choice: "auto", // LLM decides wheter to call a tool
		parallel_tool_calls: false,
		tools,
	});
	return response.choices[0].message;
};
