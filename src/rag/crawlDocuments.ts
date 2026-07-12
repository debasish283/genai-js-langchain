import * as cheerio from "cheerio";
import fetch from "node-fetch";
import urlModule from "url";
import cliProgress from "cli-progress";

// Official LangChain documentation entry point for crawling
const LANGCHAIN_DOCS_HOME = "https://js.langchain.com/docs/introduction";
const LANGCHAIN_DOCS_PREFIX = "/docs/";
const MAX_PAGES = 15; // Safeguard to limit crawl size on the live site

const progressBar = new cliProgress.SingleBar({
  format: "Documents Crawled: {value}/{total}",
});

export async function crawlLangchainDocsUrls(): Promise<string[]> {
  const urls = new Set<string>();

  console.log("Crawling Langchain Documentation...");
  progressBar.start(MAX_PAGES, 0);

  await fetchLinkedUrls(LANGCHAIN_DOCS_HOME, urls);

  progressBar.stop();
  return [...urls];
}

async function fetchLinkedUrls(url: string, downloadedUrls: Set<string>) {
  if (downloadedUrls.has(url)) return;
  if (downloadedUrls.size >= MAX_PAGES) return;

  progressBar.update(downloadedUrls.size + 1);
  try {
    const response = await fetch(url);

    const html = await response.text();
    const $ = cheerio.load(html);

    downloadedUrls.add(url); // Add URL to downloaded set

    // Extract all anchor tags
    const links: string[] = [];
    $("a").each((index, element) => {
      const href = $(element).attr("href");
      if (href && href.startsWith(LANGCHAIN_DOCS_PREFIX)) {
        links.push(href);
      }
    });

    // Download HTML from linked URLs with reduced depth
    for (const link of links) {
      const absoluteUrl = urlModule.resolve(url, link);
      await fetchLinkedUrls(absoluteUrl, downloadedUrls);
    }
  } catch (error) {
    console.error(`Error downloading HTML from ${url}: ${error}`);
  }
}
