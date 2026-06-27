import { Pinecone } from "@pinecone-database/pinecone";

// Initialize the Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "dummy-key",
});

export const getPineconeIndex = () => {
  const indexName = process.env.PINECONE_INDEX as string;
  if (!indexName) {
    throw new Error("PINECONE_INDEX environment variable is not set.");
  }
  return pinecone.Index(indexName);
};

export default pinecone;
