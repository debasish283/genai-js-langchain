import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import readlinePromises from "readline/promises";

dotenv.config();

export const runPersonalisedPitch = async (rl: readlinePromises.Interface) => {

  try {
    console.log("\n--- Personalized Pitch Generator (LCEL Chain) ---");
    const course = (await rl.question("Enter the subject/course (default: Generative AI): ")).trim() || "Generative AI";
    const role = (await rl.question("Enter target job role (default: JavaScript Developer): ")).trim() || "JavaScript Developer";
    const limitStr = await rl.question("Enter word limit (default: 100): ");
    const wordLimit = parseInt(limitStr.trim(), 10) || 100;

    console.log("\nInitializing LLM...");

    let llm;
    if (process.env.ANTHROPIC_API_KEY) {
      console.log("Using Anthropic Claude model...");
      llm = new ChatAnthropic({
        model: "claude-sonnet-4-0",
        maxTokens: wordLimit * 2 + 50,
        topP: 0.2,
      });
    } else if (process.env.OPENAI_API_KEY) {
      console.log("Using OpenAI GPT-4o-mini model...");
      llm = new ChatOpenAI({
        model: "gpt-4o-mini",
        maxTokens: wordLimit * 2 + 50,
        temperature: 0.7,
      });
    } else {
      throw new Error("Neither ANTHROPIC_API_KEY nor OPENAI_API_KEY was found in environment variables.");
    }

    const promptTemplate = new PromptTemplate({
      template:
        "Describe the importance of learning {course} for a role {role}. Limit the output to {wordLimit} words.",
      inputVariables: ["course", "role", "wordLimit"],
    });

    const outputParser = new StringOutputParser();
    const lcelChain = RunnableSequence.from([promptTemplate, llm, outputParser]);

    console.log("Generating pitch...\n");
    const response = await lcelChain.invoke({
      course,
      role,
      wordLimit,
    });

    console.log("----------------------------------------");
    console.log(response);
    console.log("----------------------------------------\n");
  } catch (error: any) {
    console.error("Error generating pitch:", error?.message || error);
  }
};
