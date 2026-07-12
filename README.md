# LangChain.js Generative AI Showcase CLI

An interactive TypeScript terminal application demonstrating advanced LLM chaining, document crawling, embeddings, vector databases, and Retrieval-Augmented Generation (RAG) pipelines using **LangChain.js**.

This project provides a unified command-line interface (CLI) to run and experiment with multiple generative AI architectures across various industry-standard providers.

---

## 🌟 Key Features

1. **Personalized Pitch Generator (LCEL LLM Chain)**
   - Formulates professional pitches using modern **LangChain Expression Language (LCEL)** pipelines.
   - Automatically adapts LLM selection based on active environment credentials (supports **Anthropic Claude 3.5 Sonnet** and **OpenAI GPT-4o-mini**).

2. **Embeddings API Demo**
   - Generates and showcases numerical vector representation of textual data.
   - Uses **OpenAI Embeddings** or **Google Gemini Embeddings** to generate dense vectors.

3. **Pinecone Vectorization Pipeline (RAG Setup)**
   - **Crawler**: Custom recursive crawler using **Cheerio** to discover documentation pages.
   - **Loader**: Loads raw HTML content using `CheerioWebBaseLoader`.
   - **Splitter**: Splits articles into overlapping semantic chunks with `RecursiveCharacterTextSplitter`.
   - **Store**: Embeds text chunks in batches and indexes them inside a **Pinecone Vector Database** namespace.

4. **Simple RAG Chat (Interactive CLI)**
   - Accepts human questions and queries the Pinecone vector index for relevant context.
   - Feeds retrieved context to OpenAI GPT-4o-mini to return precise, context-bounded answers in real-time.

5. **RAG Chat with Conversational Memory & History**
   - Employs a dual-chain LCEL architecture.
   - **Contextualization Chain**: Uses past dialogue history to reformulate relative queries (e.g., "what is it?") into standalone search queries.
   - **RAG Generation Chain**: Feeds contextualized queries to Pinecone and generates chat answers while preserving conversation state.

---

## 🛠️ Technology Stack

- **Framework**: [LangChain.js](https://js.langchain.com/) (Core, Community, Text Splitters, Pinecone Integration)
- **Runtime**: [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/) & [ts-node](https://github.com/TypeStrong/ts-node)
- **Vector Database**: [Pinecone Database](https://www.pinecone.io/)
- **LLM API Providers**: 
  - **OpenAI** (Chat Models, Embeddings)
  - **Anthropic** (Claude Chat Models)
  - **Google Gemini** (Gemini Embeddings)
- **Scraping & Parsing**: [Cheerio](https://cheerio.js.org/)
- **Observability**: [LangSmith](https://www.langchain.com/langsmith) (optional, for chain tracing)

---

## 🚀 Setup & Installation

### 1. Clone the Project
```bash
git clone <your-repository-url>
cd genai-js-langchain
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `example.env` into a new `.env` file:
```bash
cp example.env .env
```
Fill in the API keys for the services you want to use:
```env
OPENAI_API_KEY="your-openai-api-key"
GOOGLE_API_KEY="your-google-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
PINECONE_API_KEY="your-pinecone-api-key"

# LangSmith Observability (Optional)
LANGCHAIN_TRACING_V2="true"
LANGCHAIN_ENDPOINT="https://api.smith.langchain.com" # Or apac regional endpoint if applicable
LANGCHAIN_API_KEY="your-langchain-api-key"
```

*Note: For the RAG functionalities (Options 3, 4, and 5), please ensure you create a Pinecone index named `langchain-docs` with **1536 dimensions** (OpenAI `text-embedding-3-small` default).*

---

## 💻 Running the Application

### Development Mode
Runs the TypeScript CLI directly using `ts-node`:
```bash
npm run dev
```

### Production Build & Run
Compile TypeScript into production JavaScript under the `/dist` directory:
```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
├── src/
│   ├── app.ts                  # Main CLI entry point & menu router
│   ├── llm-chain/
│   │   └── pitchGenerator.ts   # LCEL Personalized Pitch generator
│   ├── rag/
│   │   ├── crawlDocuments.ts   # cheero website URL crawler
│   │   ├── loadDocuments.ts    # Document load manager
│   │   ├── splitDocuments.ts   # Document chunking utility
│   │   ├── vectorization.ts    # Crawl-load-split-store Pinecone pipeline
│   │   ├── embeddings.ts       # Embeddings comparison script
│   │   ├── retriever.ts        # Pinecone search retriever constructor
│   │   ├── ragLcel.ts          # LCEL Simple QA chat loop
│   │   └── ragChatHistory.ts   # LCEL Memory QA chat loop
│   └── utils/
│       └── chat.ts             # CLI read-eval-print loop utility
├── dist/                       # Compiled production build
├── tsconfig.json               # TypeScript compiler options
├── package.json                # Project dependencies and run scripts
└── example.env                 # Blank template for env variables
```

---

## 📤 Publishing to GitHub

To upload this cleaned project to your own GitHub account, run the following commands:

1. **Remove original Git remote configuration** (if cloned from tutorial):
   ```bash
   git remote remove origin
   ```
2. **Re-initialize Git (optional clean start)**:
   ```bash
   # Caution: This will remove git history of the course files
   rm -rf .git
   git init
   git checkout -b main
   ```
3. **Stage and commit your files**:
   ```bash
   git add .
   git commit -m "Initial commit: LangChain.js CLI Generative AI showcase app"
   ```
4. **Create a repository on GitHub**, then copy its URL and run:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE). Feel free to modify and build upon it!
