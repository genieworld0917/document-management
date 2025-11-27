# Document Management Website

Modern Next.js application for uploading documents, persisting metadata in PostgreSQL, and generating AI-powered insights that are indexed into Pinecone for semantic retrieval.

## Architecture Overview

- **Next.js App Router** drives the UI and API routes.
- **Prisma + PostgreSQL** store documents, analysis summaries, and chunk metadata.
- **OpenAI** performs summarisation plus embedding generation.
- **Pinecone** stores chunk embeddings for downstream semantic search and retrieval-augmented generation (RAG).
- **Service Layer (`services/*`)** encapsulates document CRUD plus the analysis workflow, so the UI/API remain thin.

## Prerequisites

- Node.js 20+
- npm (bundled), pnpm or yarn
- Docker (recommended for the local PostgreSQL instance)
- OpenAI API key with access to GPT-4.1 or GPT-4o-mini family
- Pinecone API key and an index provisioned for `text-embedding-3-small` vectors (1,536 dimensions)

## Environment Variables

Copy `.env.example` to `.env.local` and populate every secret before running the stack:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/document_management?schema=public"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4.1-mini"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"
PINECONE_API_KEY="pc-..."
PINECONE_INDEX="document-management"
PINECONE_ENVIRONMENT="us-east-1-aws"
```

> `OPENAI_MODEL` / `OPENAI_EMBEDDING_MODEL` are optional overrides—the defaults above are used when the variables are omitted.

## Running PostgreSQL Locally

```bash
docker compose up -d postgres
```

The container exposes `localhost:5432` and writes data into the `postgres-data` volume for durability.

## Database Migrations

Install dependencies and deploy the Prisma schema:

```bash
npm install
npx prisma migrate deploy
```

During local development you can iterate quickly with:

```bash
npx prisma migrate dev --name <change-name>
```

## Development Workflow

```bash
npm run dev
```

1. Upload documents through the UI. The API persists metadata immediately while marking the record as `UPLOADING`.
2. Use the “Analyze” action for a document. The `analysis-service` orchestrates OpenAI (summary + embeddings) and Pinecone (vector storage), then stores structured results in PostgreSQL.
3. Visit the document’s insights page to explore the latest summary, sentiment, and Pinecone footprint (`DocumentChunk` records).

Because file storage is not yet wired up, the current analysis service uses placeholder content derived from the filename. Replace the placeholder block inside `services/analysis-service.ts` with real file retrieval logic (S3, GCS, etc.) once those integrations are ready.



