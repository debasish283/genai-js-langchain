import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createRetriever } from "./retriever.js";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "@langchain/classic/util/document";
import { chat, ChatHandler } from "../utils/chat.js";
import { BaseMessage, AIMessage, HumanMessage } from "@langchain/core/messages";
import readlinePromises from "readline/promises";

export const runRagWithHistory = async (rl: readlinePromises.Interface) => {
  try {
    console.log("\nInitializing RAG Chat with Conversational History...");
    console.log("Connecting to Pinecone and retrieving index...");
    const retriever = await createRetriever();

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "human",
        `You are an AI assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer. Use three sentences maximum. If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
        Context: {context}`,
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "{question}"],
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
        chat_history: (input: any) => input.chat_history,
      },
      prompt,
      llm,
      outputParser,
    ]);

    const qcSystemPrompt =
      "Given a chat history and the latest user question which might reference context in the chat history, formulate standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is.";

    const qcPrompt = ChatPromptTemplate.fromMessages([
      ["system", qcSystemPrompt],
      new MessagesPlaceholder("chat_history"),
      ["human", "{question}"],
    ]);

    const qcChain = RunnableSequence.from([qcPrompt, llm, outputParser]);

    const chatHistory: BaseMessage[] = [];

    const chatHandler: ChatHandler = async (question: string) => {
      let contextualizedQuestion = null;
      if (chatHistory.length > 0) {
        contextualizedQuestion = await qcChain.invoke({
          question,
          chat_history: chatHistory,
        });
        console.log(`Contextualized Question: ${contextualizedQuestion}`);
      }
      return {
        answer: generationChain.stream({
          question: contextualizedQuestion || question,
          chat_history: chatHistory,
        }),
        answerCallBack: async (answerText: string) => {
          chatHistory.push(new HumanMessage(question));
          chatHistory.push(new AIMessage(answerText));
        },
      };
    };

    console.log("\n--- Interactive RAG Chat with History Interface ---");
    await chat(rl, chatHandler);
    console.log("Exited RAG chat with history session.\n");
  } catch (error: any) {
    console.error("Failed to start RAG Chat with History:", error?.message || error);
  }
};
