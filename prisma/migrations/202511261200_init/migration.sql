-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('UPLOADING', 'ANALYZING', 'ANALYZED', 'FAILED');

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "content" TEXT,
    "storageKey" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'UPLOADING',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentAnalysis" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "summary" TEXT,
    "wordCount" INTEGER,
    "pageCount" INTEGER,
    "readingTime" TEXT,
    "readability" INTEGER,
    "language" TEXT,
    "sentimentPositive" INTEGER,
    "sentimentNeutral" INTEGER,
    "sentimentNegative" INTEGER,
    "keyTopics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "entities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "vectorId" TEXT,
    "analysisModel" TEXT,
    "embeddingModel" TEXT,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentChunk" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "vectorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentAnalysis_documentId_idx" ON "DocumentAnalysis"("documentId");

-- CreateIndex
CREATE INDEX "DocumentChunk_documentId_idx" ON "DocumentChunk"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentChunk_documentId_chunkIndex_key" ON "DocumentChunk"("documentId", "chunkIndex");

-- AddForeignKey
ALTER TABLE "DocumentAnalysis" ADD CONSTRAINT "DocumentAnalysis_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChunk" ADD CONSTRAINT "DocumentChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;


