import dotenv from "dotenv";
import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import readlinePromises from "readline/promises";

dotenv.config();

export const runEmbeddingsDemo = async (rl: readlinePromises.Interface) => {

  try {
    console.log("\n--- Embeddings API Demo ---");
    const query = (await rl.question("Enter text to embed (default: 'What is vector embedding?'): ")).trim() || "What is vector embedding?";

    console.log("\nInitializing Embeddings model...");
    let embeddingsLLM;

    if (process.env.OPENAI_API_KEY) {
      console.log("Using OpenAIEmbeddings (text-embedding-3-small)...");
      embeddingsLLM = new OpenAIEmbeddings({
        modelName: "text-embedding-3-small",
      });
    } else if (process.env.GOOGLE_API_KEY) {
      console.log("Using GoogleGenerativeAIEmbeddings (text-embedding-004)...");
      embeddingsLLM = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
      });
    } else {
      throw new Error("Neither OPENAI_API_KEY nor GOOGLE_API_KEY was found in environment variables.");
    }

    console.log(`Generating embedding for: "${query}"...`);
    const embeddings = await embeddingsLLM.embedQuery(query);

    console.log("----------------------------------------");
    console.log("Embedding vector preview (first 10 dimensions):");
    console.log(JSON.stringify(embeddings.slice(0, 10)) + " ...");
    console.log(`Total Vector Length / Dimensions: ${embeddings.length}`);
    console.log("----------------------------------------\n");
  } catch (error: any) {
    console.error("Error generating embeddings:", error?.message || error);
  }
};
