import { prisma } from "@/lib/db"
import { getOpenAIClient, getDefaultCompletionModel, getDefaultEmbeddingModel } from "@/lib/openai"
import { getPineconeIndex } from "@/lib/pinecone"
import type { ChatMessage, ChatSource } from "@/types/chat"

type UsageStats = {
  promptTokens: number | null
  completionTokens: number | null
}

type ChatResult = {
  message: ChatMessage
  sources: ChatSource[]
  usage: UsageStats
}

const ERROR_CODES = {
  NOT_FOUND: "DOCUMENT_NOT_FOUND",
  NOT_ANALYZED: "DOCUMENT_NOT_ANALYZED",
  NO_USER_MESSAGE: "NO_USER_MESSAGE",
} as const

function buildError(code: (typeof ERROR_CODES)[keyof typeof ERROR_CODES], detail?: string) {
  const error = new Error(code)
  if (detail) {
    error.cause = detail
  }
  return error
}

async function fetchDocument(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  if (!document) {
    throw buildError(ERROR_CODES.NOT_FOUND)
  }

  if (document.status !== "ANALYZED") {
    throw buildError(ERROR_CODES.NOT_ANALYZED)
  }

  return {
    document,
    analysis: document.analyses[0] ?? null,
  }
}

async function fetchContextFromPinecone(documentId: string, query: string) {
  const openai = getOpenAIClient()
  const embeddingModel = getDefaultEmbeddingModel()
  const index = getPineconeIndex()

  const embeddingResponse = await openai.embeddings.create({
    model: embeddingModel,
    input: query,
  })

  const vector = embeddingResponse.data[0]?.embedding
  if (!vector) {
    return []
  }

  try {
    const response = await index.query({
      topK: 5,
      vector,
      includeMetadata: true,
      filter: {
        documentId: { $eq: documentId },
      },
    })

    return response.matches ?? []
  } catch (error) {
    console.warn("[chat-service][fetchContextFromPinecone]", error)
    return []
  }
}

async function fallbackChunks(documentId: string) {
  return prisma.documentChunk.findMany({
    where: { documentId },
    orderBy: { chunkIndex: "asc" },
    take: 3,
  })
}

function normalizeSources(
  matches: Array<{
    score?: number | null
    metadata?: Record<string, unknown>
  }>,
): ChatSource[] {
  return matches
    .map((match) => {
      const metadata = match.metadata ?? {}
      const text = typeof metadata.text === "string" ? metadata.text : null

      if (!text) return null

      return {
        chunkIndex: typeof metadata.chunkIndex === "number" ? metadata.chunkIndex : 0,
        text,
        score: typeof match.score === "number" ? match.score : null,
      }
    })
    .filter((source): source is ChatSource => Boolean(source))
}

function truncateContext(sources: ChatSource[], maxChars = 4000) {
  if (sources.length === 0) return "No document context was retrieved. Base your answer on prior knowledge."

  const parts: string[] = []
  let remaining = maxChars

  for (const source of sources) {
    const snippet = source.text.slice(0, remaining)
    const chunkString = `Chunk #${source.chunkIndex}:\n${snippet}`.trim()

    if (chunkString.length > remaining) break

    parts.push(chunkString)
    remaining -= chunkString.length + 2

    if (remaining <= 0) break
  }

  return parts.join("\n\n")
}

export async function chatAboutDocument(documentId: string, messages: ChatMessage[]): Promise<ChatResult> {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")

  if (!lastUserMessage) {
    throw buildError(ERROR_CODES.NO_USER_MESSAGE)
  }

  const { document, analysis } = await fetchDocument(documentId)

  const pineconeMatches = await fetchContextFromPinecone(documentId, lastUserMessage.content)
  let sources = normalizeSources(pineconeMatches)

  if (sources.length === 0) {
    const fallback = await fallbackChunks(documentId)
    sources = fallback.map((chunk) => ({
      chunkIndex: chunk.chunkIndex,
      text: chunk.content,
      score: null,
    }))
  }

  const contextBlock = truncateContext(sources)

  const systemPrompt = `You are an AI assistant that answers questions about a document titled "${document.filename}". Use the provided context verbatim when possible, and be explicit when the information is not available.`
  const summaryPrompt = analysis?.summary ? `Latest summary:\n${analysis.summary}` : null
  const guidancePrompt = `Document context:\n${contextBlock}`

  const openai = getOpenAIClient()
  const model = getDefaultCompletionModel()

  const input = [
    { role: "system", content: systemPrompt },
    summaryPrompt ? { role: "system", content: summaryPrompt } : null,
    { role: "system", content: guidancePrompt },
    ...messages,
  ].filter(Boolean) as { role: "system" | "user" | "assistant"; content: string }[]

  const completion = await openai.chat.completions.create({
    model,
    messages: input,
  })

  const textOutput = completion.choices[0]?.message?.content?.trim() || "I could not generate a response at this time."

  const usage: UsageStats = {
    promptTokens: completion.usage?.prompt_tokens ?? null,
    completionTokens: completion.usage?.completion_tokens ?? null,
  }

  return {
    message: {
      role: "assistant",
      content: textOutput,
    },
    sources,
    usage,
  }
}

export const chatErrors = ERROR_CODES

export async function generateDocumentOverview(documentId: string) {
  const overviewPrompt = `Provide a rich yet concise overview for readers who have not seen the document.

Include the following sections:
1. Title suggestion
2. Executive summary (3-4 sentences)
3. Key themes (unordered list)
4. Keywords (comma separated)
5. Recommended next steps or questions to consider

Base everything strictly on the provided document context.`

  const result = await chatAboutDocument(documentId, [
    {
      role: "user",
      content: overviewPrompt,
    },
  ])

  return result
}


