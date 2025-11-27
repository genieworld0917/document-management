import Link from "next/link"
import type { Document } from "@prisma/client"
import { ArrowLeft, MessageSquare, Sparkles } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ChatSource } from "@/types/chat"

type DocumentOverviewPanelProps = {
  document: Document
  overviewMarkdown: string
  sources: ChatSource[]
}

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date)

export function DocumentOverviewPanel({ document, overviewMarkdown, sources }: DocumentOverviewPanelProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/50 shadow-lg">
        <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-accent to-primary text-white">{document.mimeType}</Badge>
                <span className="text-sm text-muted-foreground">Uploaded {formatDate(document.uploadedAt)}</span>
              </div>
              <CardTitle className="text-3xl font-semibold">{document.filename}</CardTitle>
              <CardDescription>
                This overview is generated from the document&apos;s analyzed chunks to help you grasp the content quickly.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Documents
                </Button>
              </Link>
              <Link href={`/documents/${document.id}/chat`}>
                <Button size="sm" variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Deep-dive chat
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="prose prose-muted max-w-none pt-6 dark:prose-invert">
          <div className="rounded-2xl border border-border/50 bg-muted/10 p-6 shadow-inner">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              AI-crafted overview
            </div>
            <article className="prose prose-sm mt-4 max-w-none whitespace-pre-wrap text-foreground dark:prose-invert">
              {overviewMarkdown}
            </article>
          </div>
        </CardContent>
      </Card>

      {sources.length > 0 && (
        <Card className="overflow-hidden border-border/50 shadow-lg">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
            <CardTitle className="text-xl">Referenced document excerpts</CardTitle>
            <CardDescription>Top chunks that informed this overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {sources.map((source, index) => (
              <div key={`${source.chunkIndex}-${index}`} className="rounded-xl border border-border/40 bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Chunk #{source.chunkIndex}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{source.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}


