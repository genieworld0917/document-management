import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Sparkles } from "lucide-react"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"

export default async function AnalyzePage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = await params

  const document = await prisma.document.findUnique({
    where: { id: resolvedParams.id },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      chunks: {
        orderBy: { chunkIndex: "asc" },
      },
    },
  })

  if (!document) {
    notFound()
  }

  const analysis = document.analyses[0] ?? null
  const chunks = document.chunks ?? []

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-16 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Documents
            </Button>
          </Link>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Document Insights & Content
          </p>
        </div>

        {analysis && (
          <Card className="overflow-hidden border-border/50 shadow-lg">
            <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <CardTitle className="text-xl">Document Summary</CardTitle>
              </div>
              <CardDescription>AI-generated overview from analyzed content</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {analysis.summary && (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Executive Summary
                  </p>
                  <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                    {analysis.summary}
                  </p>
                </div>
              )}

              {(analysis.keyTopics?.length ?? 0) > 0 && (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Key Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keyTopics.map((topic: string, index: number) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm font-medium">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(analysis.entities?.length ?? 0) > 0 && (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Key Entities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.entities.map((entity: string, index: number) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 text-sm font-medium">
                        {entity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="overflow-hidden border-border/50 shadow-lg">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
            <CardTitle className="text-xl">{document.filename}</CardTitle>
            <CardDescription>Full document content reconstructed from analyzed chunks</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {chunks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This document does not yet have any analyzed chunks. Please run analysis first.
              </p>
            ) : (
              <article className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground dark:prose-invert">
                {chunks.map((chunk: (typeof chunks)[number]) => chunk.content).join("\n\n")}
              </article>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
