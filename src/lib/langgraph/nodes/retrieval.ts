import { GraphStateType } from "../state";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { getPineconeIndex } from "../../pinecone";

export const retrievalNode = async (state: GraphStateType): Promise<Partial<GraphStateType>> => {
  console.log("--- RETRIEVAL NODE ---");

  if (!state.query) {
    return { currentStep: "retrieval", retrievedContext: [] };
  }

  // 1. Vectorize the query using Gemini 2.5 Flash embeddings
  const embeddingsModel = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.GOOGLE_API_KEY,
  });
  
  const queryVector = await embeddingsModel.embedQuery(state.query);

  // 2. Similarity search in Pinecone
  const pineconeIndex = getPineconeIndex();
  
  const searchResults = await pineconeIndex.query({
    vector: queryVector,
    topK: 3, // Can be tweaked in HITL mode
    includeMetadata: true,
  });

  // 3. Extract text from results
  const retrievedContext = searchResults.matches
    .filter((match) => match.metadata && match.metadata.text)
    .map((match) => match.metadata!.text as string);

  return {
    retrievedContext,
    currentStep: "retrieval",
  };
};
