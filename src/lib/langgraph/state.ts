import { Annotation } from "@langchain/langgraph";

export const GraphState = Annotation.Root({
  // The user's original inputs
  documentUrl: Annotation<string>(), // URL or identifier for uploaded doc
  documentText: Annotation<string>(), // Extracted text from the doc
  query: Annotation<string>(),

  // Intermediate outputs
  chunks: Annotation<string[]>(), // Array of document chunks
  embeddings: Annotation<number[][]>(), // Numerical representations
  retrievedContext: Annotation<string[]>(), // Chunks retrieved from Pinecone

  // Final output
  answer: Annotation<string>(),

  // Tracking current step for Human-in-the-loop (HITL) visualization
  currentStep: Annotation<string>(),
});

export type GraphStateType = typeof GraphState.State;
