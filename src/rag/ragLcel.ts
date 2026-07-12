import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createRetriever } from "./retriever.js";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "@langchain/classic/util/document";
import { chat, ChatHandler } from "../utils/chat.js";
import readlinePromises from "readline/promises";

export const runSimpleRagChat = async (rl: readlinePromises.Interface) => {
  try {
    console.log("\nInitializing Simple RAG Chat...");
    console.log("Connecting to Pinecone and retrieving index...");
    const retriever = await createRetriever();

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "human",
        `You are an AI assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer. Use three sentences maximum. If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
        
        Question: {question},
        Context: {context}
        Answer:`,
      ],
    ]);

    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      maxTokens: 500,
    });

    const outputParser = new StringOutputParser();

    const retrievalChain = RunnableSequence.from([
      (input: any) => input.question,
      retriever,
      formatDocumentsAsString,
    ]);

    const generationChain = RunnableSequence.from([
      {
        question: (input: any) => input.question,
        context: retrievalChain,
      },
      prompt,
      llm,
      outputParser,
    ]);

    const chatHandler: ChatHandler = async (question: string) => {
      return {
        answer: generationChain.stream({
          question,
        }),
      };
    };

    console.log("\n--- Interactive RAG Chat Interface ---");
    await chat(rl, chatHandler);
    console.log("Exited simple RAG chat session.\n");
  } catch (error: any) {
    console.error("Failed to start Simple RAG Chat:", error?.message || error);
  }
};
