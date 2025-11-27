import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MessageSquare } from "lucide-react"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import { DocumentChat } from "@/components/document-chat"

type DocumentChatPageProps = {
  params: {
    id: string
  }
}

export default async function DocumentChatPage({ params }: DocumentChatPageProps) {
  const document = await prisma.document.findUnique({
    where: { id: params.id },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  if (!document) {
    notFound()
  }

  const latestAnalysis = document.analyses[0] ?? null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-16">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to documents
              </span>
            </Link>
            <div className="hidden h-4 w-px bg-border md:block" />
            <p className="text-sm text-muted-foreground">Document chat</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-1 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4 text-accent" />
            Answers grounded by your document embeddings
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <DocumentChat documentId={document.id} documentName={document.filename} summary={latestAnalysis?.summary} />
          <Card className="border-border/50 shadow-md">
            <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
              <CardTitle>Document snapshot</CardTitle>
              <CardDescription>Key metadata pulled from the latest analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Filename</p>
                <p className="font-semibold">{document.filename}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">MIME type</p>
                <p className="font-semibold">{document.mimeType}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                <p className="font-semibold text-accent">{document.status.toLowerCase()}</p>
              </div>
              {latestAnalysis?.keyTopics?.length ? (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Key topics</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {latestAnalysis.keyTopics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-border/40 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


