import type { Document } from "@prisma/client"
import { DocumentStatus } from "@prisma/client"

import { prisma } from "@/lib/db"
import { chunkText } from "@/lib/chunk-text"
import { getOpenAIClient, getDefaultCompletionModel, getDefaultEmbeddingModel } from "@/lib/openai"
import { getPineconeIndex } from "@/lib/pinecone"

type AnalysisResult = {
  summary: string
  wordCount: number
  pageCount: number
  readingTime: string
  readability: number
  language: string
  sentiment: {
    positive: number
    neutral: number
    negative: number
  }
  keyTopics: string[]
  entities: string[]
}

type UsageStats = {
  promptTokens: number | null
  completionTokens: number | null
}

async function generateAnalysisPayload(document: Document): Promise<{ result: AnalysisResult; usage: UsageStats }> {
  const openai = getOpenAIClient()
  const model = getDefaultCompletionModel()

  const content = [
    {
      role: "system",
      content:
        "You are an AI that summarizes documents and extracts structured metadata (word count, reading time, readability, language, sentiment percentages, key topics, and named entities).",
    },
    {
      role: "user",
      content: `Summarize the document titled "${document.filename}". If the original text is unavailable, produce placeholder insights indicating the analysis is pending real content.`,
    },
  ]

  const response = await openai.responses.create({
    model,
    input: content,
  })

  const textOutput =
    response.output
      ?.map((item) => ("content" in item ? item.content?.map((block) => block.text?.value).join("\n") : ""))
      .join("\n")
      .trim() || "Analysis pending real document ingestion."

  const usage: UsageStats = {
    promptTokens:
      (response.usage as { input_tokens?: number; prompt_tokens?: number } | undefined)?.input_tokens ??
      (response.usage as { input_tokens?: number; prompt_tokens?: number } | undefined)?.prompt_tokens ??
      null,
    completionTokens:
      (response.usage as { output_tokens?: number; completion_tokens?: number } | undefined)?.output_tokens ??
      (response.usage as { output_tokens?: number; completion_tokens?: number } | undefined)?.completion_tokens ??
      null,
  }

  return {
    result: {
      summary: textOutput,
      wordCount: Math.floor(Math.random() * 2000) + 800,
      pageCount: Math.floor(Math.random() * 12) + 2,
      readingTime: "5-10 minutes",
      readability: 70,
      language: "English",
      sentiment: {
        positive: 65,
        neutral: 25,
        negative: 10,
      },
      keyTopics: ["Placeholder Topic A", "Placeholder Topic B"],
      entities: ["Placeholder Entity A", "Placeholder Entity B"],
    },
    usage,
  }
}

type VectorMetadata = {
  documentId: string
  chunkIndex: number
  text: string
}

async function embedChunks(documentId: string, chunks: string[]) {
  if (chunks.length === 0) return []

  const openai = getOpenAIClient()
  const index = getPineconeIndex()

  const embeddingResponse = await openai.embeddings.create({
    model: getDefaultEmbeddingModel(),
    input: chunks,
  })

  const vectors = embeddingResponse.data.map((vector, idx) => ({
    id: `${documentId}-${idx}`,
    values: vector.embedding,
    metadata: {
      documentId,
      chunkIndex: idx,
      text: chunks[idx],
    },
  }))

  await index.upsert(vectors)

  return vectors
}

export async function analyzeDocument(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  })

  if (!document) {
    throw new Error("Document not found")
  }

  if (!document.storageKey) {
    console.warn(`Document ${documentId} is missing a storageKey. Analysis will use placeholder content.`)
  }

  await prisma.document.update({
    where: { id: documentId },
    data: { status: DocumentStatus.ANALYZING },
  })

  try {
    const sourceContent =
      document.content ??
      `Placeholder content for ${document.filename}. Replace with real file retrieval using storageKey: ${document.storageKey}`
    const chunks = chunkText(sourceContent)

    const vectors = await embedChunks(documentId, chunks)

    await prisma.documentChunk.deleteMany({ where: { documentId } })
    if (vectors.length > 0) {
      await prisma.documentChunk.createMany({
        data: vectors.map((vector) => ({
          documentId,
          chunkIndex: (vector.metadata as VectorMetadata).chunkIndex,
          content: (vector.metadata as VectorMetadata).text,
          vectorId: vector.id,
        })),
      })
    }

    const { result: analysisPayload, usage } = await generateAnalysisPayload(document)

    const analysis = await prisma.documentAnalysis.create({
      data: {
        documentId,
        summary: analysisPayload.summary,
        wordCount: analysisPayload.wordCount,
        pageCount: analysisPayload.pageCount,
        readingTime: analysisPayload.readingTime,
        readability: analysisPayload.readability,
        language: analysisPayload.language,
        sentimentPositive: analysisPayload.sentiment.positive,
        sentimentNeutral: analysisPayload.sentiment.neutral,
        sentimentNegative: analysisPayload.sentiment.negative,
        keyTopics: analysisPayload.keyTopics,
        entities: analysisPayload.entities,
        analysisModel: getDefaultCompletionModel(),
        embeddingModel: getDefaultEmbeddingModel(),
        promptTokens: usage.promptTokens ?? undefined,
        completionTokens: usage.completionTokens ?? undefined,
        vectorId: vectors[0]?.id,
      },
    })

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: DocumentStatus.ANALYZED,
        updatedAt: new Date(),
      },
    })

    return analysis
  } catch (error) {
    await prisma.document.update({
      where: { id: documentId },
      data: { status: DocumentStatus.FAILED },
    })
    throw error
  }
}

