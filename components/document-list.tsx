"use client"

import { useMemo, useState } from "react"
import useSWR, { useSWRConfig } from "swr"

import { FileText, Download, BarChart3, Clock, AlertCircle, Sparkles, Loader2, MessageSquare } from "lucide-react"
import Link from "next/link"
import type { DocumentStatus } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { DOCUMENTS_API_PATH, analyzeDocumentApiPath } from "@/lib/constants"
import { useToast } from "@/hooks/use-toast"

const fetcher = async (url: string) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to load documents")
  }

  return response.json()
}

type ApiDocument = {
  id: string
  filename: string
  mimeType: string
  sizeBytes: number
  status: DocumentStatus
  uploadedAt: string
  updatedAt: string
  latestAnalysis: {
    id: string
    createdAt: string
  } | null
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))

const formatFileSize = (bytes: number) => {
  if (!bytes) return "0 KB"
  const units = ["bytes", "KB", "MB", "GB"]
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, index)

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

export function DocumentList() {
  const { data, error, isLoading } = useSWR<{ documents: ApiDocument[] }>(DOCUMENTS_API_PATH, fetcher, {
    refreshInterval: 30_000,
  })

  const documents = useMemo(() => data?.documents ?? [], [data])
  const { mutate } = useSWRConfig()
  const { toast } = useToast()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleDownload = (doc: ApiDocument) => {
    alert(`Would download: ${doc.filename}`)
  }

  const handleAnalyze = async (doc: ApiDocument) => {
    if (processingId) return

    setProcessingId(doc.id)
    try {
      const response = await fetch(analyzeDocumentApiPath(doc.id), {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to start analysis")
      }

      toast({
        title: "Analysis started",
        description: `We're processing "${doc.filename}" with OpenAI and Pinecone.`,
      })

      mutate(DOCUMENTS_API_PATH)
    } catch (err) {
      console.error(err)
      toast({
        title: "Analysis failed",
        description: "We could not start the analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <Card className="overflow-hidden border-border/50 shadow-lg shadow-primary/5">
      <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <FileText className="h-4 w-4 text-accent" />
          </div>
          <div>
            <CardTitle className="text-2xl">Your Documents</CardTitle>
            <CardDescription className="mt-1">Manage and analyze your uploaded documents</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-xl" />
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>Unable to load your documents. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && documents.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-10 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">No documents yet</p>
              <p className="text-sm text-muted-foreground">Upload your first document to see it listed here.</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {documents.map((doc) => {
            const isAnalyzed = doc.status === "ANALYZED"
            const isAnalyzing = doc.status === "ANALYZING"
            const isProcessing = processingId === doc.id || isAnalyzing

            return (
              <div
                key={doc.id}
                className="group flex flex-col gap-5 rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-5 shadow-sm transition-all hover:border-accent/30 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 transition-all group-hover:from-accent/30 group-hover:to-primary/30">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{doc.filename}</h3>
                      <Badge
                        variant={isAnalyzed ? "default" : "secondary"}
                        className={cn(
                          "text-xs",
                          isAnalyzed && "bg-gradient-to-r from-accent/90 to-primary/90 text-white",
                        )}
                      >
                        {isAnalyzed ? "Analyzed" : doc.status.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                        <span>{formatFileSize(doc.sizeBytes)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                        <span>{doc.mimeType || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDate(doc.uploadedAt)}</span>
                      </div>
                      {doc.latestAnalysis && (
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-accent" />
                          <span>Analyzed {formatDate(doc.latestAnalysis.createdAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <Link href={`/documents/${doc.id}/analyze`} className="flex-1 sm:flex-none">
                    <Button variant="outline" size="sm" className="w-full bg-transparent" disabled={!isAnalyzed}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Insights
                    </Button>
                  </Link>
                  <Link href={`/documents/${doc.id}/chat`} className="flex-1 sm:flex-none">
                    <Button variant="outline" size="sm" className="w-full bg-transparent" disabled={!isAnalyzed}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent sm:flex-none"
                    onClick={() => handleAnalyze(doc)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {isProcessing ? "Analyzing..." : "Analyze"}
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-accent to-primary sm:flex-none" onClick={() => handleDownload(doc)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
