import { NextResponse } from "next/server"
import { z } from "zod"

import { chatAboutDocument, chatErrors } from "@/services/chat-service"
import type { ChatMessage } from "@/types/chat"

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1, "Message content is required"),
})

const payloadSchema = z.object({
  messages: z.array(messageSchema).min(1, "Provide at least one message"),
})

export async function POST(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const { messages } = payloadSchema.parse(body) as { messages: ChatMessage[] }

    const result = await chatAboutDocument(resolvedParams.id, messages)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[documents][chat][POST]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }

    if (error instanceof Error) {
      if (error.message === chatErrors.NOT_FOUND) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 })
      }

      if (error.message === chatErrors.NOT_ANALYZED) {
        return NextResponse.json({ error: "Document must be analyzed before chatting" }, { status: 409 })
      }

      if (error.message === chatErrors.NO_USER_MESSAGE) {
        return NextResponse.json({ error: "A user prompt is required" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Failed to generate chat response" }, { status: 500 })
  }
}


