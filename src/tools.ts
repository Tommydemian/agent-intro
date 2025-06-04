import type { ChatCompletionTool } from "openai/resources/chat/completions";

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
		// fake example — you can replace this with real API logic
		const fakeWeather = `It's 22°${unit.toUpperCase()} in ${location}.`;
		return fakeWeather;
	},
};
