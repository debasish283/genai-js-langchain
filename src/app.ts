import readlinePromises from "readline/promises";
import { runPersonalisedPitch } from "./llm-chain/pitchGenerator.js";
import { runEmbeddingsDemo } from "./rag/embeddings.js";
import { runVectorization } from "./rag/vectorization.js";
import { runSimpleRagChat } from "./rag/ragLcel.js";
import { runRagWithHistory } from "./rag/ragChatHistory.js";

const main = async () => {
  const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.clear();
  console.log("==================================================");
  console.log("    Generative AI & LangChain.js CLI Project");
  console.log("==================================================");

  let running = true;
  while (running) {
    console.log("Select an option to run:");
    console.log("1) Personalized Pitch Generator (LCEL LLM Chain)");
    console.log("2) Embeddings API Demo");
    console.log("3) Crawl & Vectorize Documents (Pinecone RAG Setup)");
    console.log("4) RAG Chat (Simple QA over Documents)");
    console.log("5) RAG Chat with Conversational Memory");
    console.log("6) Exit");
    
    const choice = (await rl.question("\nEnter your choice (1-6): ")).trim();

    switch (choice) {
      case "1":
        await runPersonalisedPitch(rl);
        break;
      case "2":
        await runEmbeddingsDemo(rl);
        break;
      case "3":
        console.log("\nStarting vectorization script...");
        await runVectorization();
        break;
      case "4":
        await runSimpleRagChat(rl);
        break;
      case "5":
        await runRagWithHistory(rl);
        break;
      case "6":
        console.log("\nExiting. Thank you for using the Generative AI & LangChain CLI!\n");
        running = false;
        rl.close();
        process.exit(0);
      default:
        console.log("\n[Error] Invalid selection. Please enter a number between 1 and 6.\n");
        break;
    }
    console.log("==================================================\n");
  }
};

main().catch((err) => {
  console.error("Critical error in CLI interface:", err);
  process.exit(1);
});
