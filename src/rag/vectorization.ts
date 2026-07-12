import dotenv from "dotenv";
import { loadDocument } from "./loadDocuments.js";
import { splitDocuments } from "./splitDocuments.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

dotenv.config();

export const runVectorization = async () => {
  try {
    console.log("\n--- Starting Vectorization Pipeline ---");

    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY is not defined in environment variables.");
    }
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not defined in environment variables.");
    }

    console.log("Step 1: Loading raw documents...");
    const rawDocuments = await loadDocument();

    console.log("Step 2: Splitting documents into chunks...");
    const chunkedDocuments = await splitDocuments(rawDocuments);

    console.log("Step 3: Initializing OpenAI Embeddings model...");
    const embeddingLLM = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small",
    });

    console.log("Step 4: Connecting to Pinecone...");
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const indexName = process.env.PINECONE_INDEX as string;
    const pineconeIndex = pinecone.Index(indexName);

    console.log(`Step 5: Storing document chunks in Pinecone (index: "${indexName}", namespace: "${process.env.PINECONE_NAMESPACE}")...`);

    for (let i = 0; i < chunkedDocuments.length; i += 100) {
      const batch = chunkedDocuments.slice(i, i + 100);
      console.log(`Uploading batch ${Math.floor(i / 100) + 1} of ${Math.ceil(chunkedDocuments.length / 100)} (${batch.length} chunks)...`);
      await PineconeStore.fromDocuments(batch, embeddingLLM, {
        pineconeIndex: pineconeIndex,
        namespace: process.env.PINECONE_NAMESPACE,
      });
    }

    console.log("Vectorization completed and stored in Pinecone successfully!\n");
  } catch (error: any) {
    console.error("Vectorization failed:", error?.message || error);
  }
};
