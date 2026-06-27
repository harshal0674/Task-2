import { GraphStateType } from "../state";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const generationNode = async (state: GraphStateType): Promise<Partial<GraphStateType>> => {
  console.log("--- GENERATION NODE ---");

  if (!state.query || !state.retrievedContext || state.retrievedContext.length === 0) {
    return { currentStep: "generation", answer: "No context available to generate an answer." };
  }

  // 1. Setup the Gemini 2.5 Flash model
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.2, // Low temperature for more factual generation
  });

  // 2. Construct dynamic prompt
  const context = state.retrievedContext.join("\n\n---\n\n");
  const prompt = `
You are an intelligent educational assistant. Use the following context to answer the user's question accurately. 
If the answer cannot be found in the context, state that you don't know based on the provided documents.

Context:
${context}

User Question: ${state.query}

Answer:
  `.trim();

  // 3. Synthesize the final answer using 1 LLM request
  const response = await llm.invoke(prompt);

  return {
    answer: response.content as string,
    currentStep: "generation",
  };
};
