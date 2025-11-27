import { prisma } from "@/lib/db"
import type { DocumentStatus } from "@prisma/client"

export type DocumentWithAnalysis = Awaited<ReturnType<typeof listDocuments>>[number]

const latestAnalysisInclude = {
  include: {
    analyses: {
      orderBy: { createdAt: "desc" } as const,
      take: 1,
    },
  },
}

function mapDocument<T extends { analyses: unknown[] }>(document: T) {
  const { analyses, ...rest } = document
  return {
    ...rest,
    latestAnalysis: analyses[0] ?? null,
  }
}

export async function listDocuments() {
  const documents = await prisma.document.findMany({
    orderBy: { uploadedAt: "desc" },
    ...latestAnalysisInclude,
  })
  return documents.map(mapDocument)
}

type CreateDocumentInput = {
  filename: string
  mimeType: string
  sizeBytes: number
  status?: DocumentStatus
  storageKey?: string | null
  content?: string | null
}

export async function createDocuments(documents: CreateDocumentInput[]) {
  if (documents.length === 0) return []

  const created = await prisma.$transaction(
    documents.map((doc) =>
      prisma.document.create({
        data: {
          filename: doc.filename,
          mimeType: doc.mimeType,
          sizeBytes: doc.sizeBytes,
          status: doc.status,
          storageKey: doc.storageKey,
          content: doc.content,
        },
        ...latestAnalysisInclude,
      }),
    ),
  )

  return created.map(mapDocument)
}


