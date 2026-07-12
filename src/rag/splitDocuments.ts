import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { loadDocument } from "./loadDocuments.js";

export async function splitDocuments(
  rawDocuments: Document[],
): Promise<Document[]> {
  console.log(`Total Raw Documents: ${rawDocuments.length}`);
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const documentChunks = await splitter.splitDocuments(rawDocuments);

  console.log(`Total Chunks: ${documentChunks.length}`);
  return documentChunks;
}

// const rawDocuments = await loadDocument();
// await splitDocuments(rawDocuments);
