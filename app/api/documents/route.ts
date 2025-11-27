import { NextResponse } from "next/server"
import { z } from "zod"

import { createDocuments, listDocuments } from "@/services/document-service"

const uploadPayloadSchema = z.object({
  documents: z
    .array(
      z.object({
        name: z.string().min(1, "File name is required"),
        size: z.number().int().nonnegative(),
        type: z.string().min(1, "MIME type is required"),
        storageKey: z.string().optional(),
        content: z.string().optional(),
      }),
    )
    .min(1, "At least one document must be provided"),
})

export async function GET() {
  try {
    const documents = await listDocuments()

    return NextResponse.json({
      documents,
    })
  } catch (error) {
    console.error("[documents][GET]", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { documents } = uploadPayloadSchema.parse(body)

    const createdDocuments = await createDocuments(
      documents.map((doc) => ({
        filename: doc.name,
        mimeType: doc.type,
        sizeBytes: doc.size,
        storageKey: doc.storageKey,
        content: doc.content,
      })),
    )

    return NextResponse.json(
      {
        documents: createdDocuments,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[documents][POST]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create documents" }, { status: 500 })
  }
}


