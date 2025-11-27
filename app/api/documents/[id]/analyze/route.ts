import { NextResponse } from "next/server"

import { analyzeDocument } from "@/services/analysis-service"

export async function POST(_: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const analysis = await analyzeDocument(resolvedParams.id)

    return NextResponse.json(
      {
        analysisId: analysis.id,
        documentId: resolvedParams.id,
      },
      { status: 202 },
    )
  } catch (error) {
    console.error("[documents][analyze][POST]", error)
    return NextResponse.json({ error: "Failed to analyze document" }, { status: 500 })
  }
}




