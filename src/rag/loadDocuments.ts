import { Document } from "langchain";
import { crawlLangchainDocsUrls } from "./crawlDocuments.js";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

export async function loadDocument(): Promise<Document[]> {
  const langchainDocsUrl = await crawlLangchainDocsUrls();
  const rawDocuments: Document[] = [];

  for (const url of langchainDocsUrl) {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    rawDocuments.push(...docs);
  }

  return rawDocuments;
}

// const rawDocuments = await loadDocument();
// console.log(rawDocuments.slice(0, 4));
