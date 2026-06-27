import { GraphStateType } from "../state";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { getPineconeIndex } from "../../pinecone";

export const ingestionNode = async (state: GraphStateType): Promise<Partial<GraphStateType>> => {
  console.log("--- INGESTION NODE ---");
  
  if (!state.documentText) {
    return { currentStep: "ingestion", chunks: [], embeddings: [] };
  }

  // 1. Chunking
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const chunks = await textSplitter.splitText(state.documentText);

  // 2. Embedding using Gemini 2.5 Flash embeddings
  const embeddingsModel = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004", // current standard for gemini embeddings
    apiKey: process.env.GOOGLE_API_KEY,
  });
  
  const embeddings = await embeddingsModel.embedDocuments(chunks);

  // 3. Storage in Pinecone
  const pineconeIndex = getPineconeIndex();
  
  const vectors = chunks.map((chunk, i) => ({
    id: `doc-${Date.now()}-chunk-${i}`,
    values: embeddings[i],
    metadata: {
      text: chunk,
      documentUrl: state.documentUrl || "unknown",
    }
  }));

  // Upsert in batches to Pinecone
  await pineconeIndex.upsert(vectors as any);

  return {
    chunks,
    embeddings,
    currentStep: "ingestion",
  };
};
