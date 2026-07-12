import type { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import dotenv from "dotenv";
dotenv.config();

export async function createRetriever(): Promise<VectorStoreRetriever> {
  const embeddingLLM = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "text-embedding-3-small",
  });

  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index("langchain-docs");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddingLLM, {
    pineconeIndex: pineconeIndex,
    namespace: "langchain-docs",
  });

  const retriever = vectorStore.asRetriever();
  return retriever;
}
