import type { Document, DocumentAnalysis, DocumentChunk } from "@prisma/client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Calendar,
  Hash,
  FileType,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react"

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date)

type AnalysisResultsProps = {
  document: Document & { chunks?: DocumentChunk[] }
  analysis?: DocumentAnalysis | null
}

export function AnalysisResults({ document, analysis }: AnalysisResultsProps) {
  const sentiment = {
    positive: analysis?.sentimentPositive ?? 0,
    neutral: analysis?.sentimentNeutral ?? 0,
    negative: analysis?.sentimentNegative ?? 0,
  }

  const keyTopics = analysis?.keyTopics ?? []
  const entities = analysis?.entities ?? []
  const chunkCount = document.chunks?.length ?? 0

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20 pb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-primary">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-gradient-to-r from-accent/90 to-primary/90 text-white">
                  <Sparkles className="mr-1 h-3 w-3" />
                  {document.status === "ANALYZED" ? "Analyzed" : document.status.toLowerCase()}
                </Badge>
              </div>
              <CardTitle className="text-3xl">{document.filename}</CardTitle>
              <CardDescription className="text-base">
                Uploaded on {formatDate(document.uploadedAt)} • {document.mimeType || "Unknown type"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {analysis?.summary ? (
            <p className="text-base leading-relaxed text-muted-foreground">{analysis.summary}</p>
          ) : (
            <p className="text-base leading-relaxed text-muted-foreground">
              Analysis details are not available yet. We will populate this section once processing completes.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 shadow-lg">
        <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
          <CardTitle className="text-xl">Document Overview</CardTitle>
          <CardDescription>High-level summary, topics, and knowledge graph highlights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Summary</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              {analysis?.summary ?? "We will populate this once the document finishes processing."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Key Topics</p>
              {keyTopics.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {keyTopics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-xs font-medium">
                      {topic}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No topics detected.</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Named Entities</p>
              {entities.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {entities.map((entity, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1 text-xs font-medium">
                      {entity}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No entities detected.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 shadow-lg">
        <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
          <CardTitle className="text-xl">Vector Store Footprint</CardTitle>
          <CardDescription>Embeddings stored in Pinecone for semantic search</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chunks Embedded</p>
            <p className="text-2xl font-semibold">{chunkCount}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Embedding Model</p>
            <p className="text-lg font-semibold">{analysis?.embeddingModel ?? "—"}</p>
          </div>
        </CardContent>
      </Card>

      {analysis ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-border/50 shadow-md transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Word Count</CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <Hash className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analysis.wordCount?.toLocaleString() ?? "—"}</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {analysis.pageCount ? `${analysis.pageCount} pages total` : "Page count unavailable"}
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/50 shadow-md transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Reading Time</CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analysis.readingTime ?? "—"}</div>
                <p className="mt-1 text-sm text-muted-foreground">Estimated duration</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/50 shadow-md transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Readability</CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {typeof analysis.readability === "number" ? `${analysis.readability}%` : "—"}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Easy to understand</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/50 shadow-md transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Language</CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <FileType className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analysis.language ?? "—"}</div>
                <p className="mt-1 text-sm text-muted-foreground">{document.mimeType || "Unknown format"}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden border-border/50 shadow-lg">
            <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
              <CardTitle className="text-xl">Sentiment Analysis</CardTitle>
              <CardDescription>Overall tone and sentiment distribution of the document</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Positive</span>
                  <span className="text-sm font-medium text-muted-foreground">{sentiment.positive}%</span>
                </div>
                <Progress value={sentiment.positive} className="h-3 bg-muted" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Neutral</span>
                  <span className="text-sm font-medium text-muted-foreground">{sentiment.neutral}%</span>
                </div>
                <Progress value={sentiment.neutral} className="h-3 bg-muted" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Negative</span>
                  <span className="text-sm font-medium text-muted-foreground">{sentiment.negative}%</span>
                </div>
                <Progress value={sentiment.negative} className="h-3 bg-muted" />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden border-border/50 shadow-lg">
              <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
                <CardTitle className="text-xl">Key Topics</CardTitle>
                <CardDescription>Main themes identified in the document</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {keyTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {keyTopics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="px-4 py-2 text-sm font-medium">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No key topics detected.</p>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/50 shadow-lg">
              <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
                <CardTitle className="text-xl">Named Entities</CardTitle>
                <CardDescription>Important names, dates, and organizations</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {entities.length > 0 ? (
                  <div className="space-y-3">
                    {entities.map((entity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10">
                          <Users className="h-4 w-4 text-accent" />
                        </div>
                        <span className="text-sm font-medium">{entity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No named entities detected.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="overflow-hidden border-border/50 shadow-lg">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
            <CardTitle className="text-xl">Analysis Pending</CardTitle>
            <CardDescription>We will show insights here once the document has been processed.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4 pt-6">
            <AlertCircle className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              This document has not been analyzed yet. Please check back later or trigger an analysis from the documents
              page.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="overflow-hidden border-border/50 shadow-lg">
        <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
          <CardTitle className="text-xl">Document Metadata</CardTitle>
          <CardDescription>Additional information about the document</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upload Date</p>
                <p className="font-semibold">{formatDate(document.uploadedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="font-semibold">{formatDate(document.updatedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">File Type</p>
                <p className="font-semibold">{document.mimeType || "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                <AlertCircle className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="font-semibold">{document.status.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
