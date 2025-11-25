"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Calendar, Hash, FileType, TrendingUp, Users, Clock, AlertCircle, Sparkles } from "lucide-react"

// Mock data for different documents
const analysisData: Record<string, any> = {
  "1": {
    name: "Q4 Financial Report.pdf",
    type: "PDF",
    uploadDate: "2024-01-15",
    summary: "Financial report analyzing Q4 performance with detailed revenue breakdown and expense analysis.",
    wordCount: 4235,
    pageCount: 24,
    readingTime: "17 minutes",
    sentiment: {
      positive: 68,
      neutral: 25,
      negative: 7,
    },
    keyTopics: ["Revenue Growth", "Operating Expenses", "Market Analysis", "Future Projections"],
    entities: ["Microsoft Corporation", "John Smith", "Q4 2023", "New York"],
    readability: 72,
    language: "English",
    lastModified: "2024-01-10",
  },
  "2": {
    name: "Project Proposal.docx",
    type: "DOCX",
    uploadDate: "2024-01-14",
    summary: "Comprehensive project proposal outlining objectives, timeline, budget, and expected outcomes.",
    wordCount: 2856,
    pageCount: 12,
    readingTime: "11 minutes",
    sentiment: {
      positive: 82,
      neutral: 15,
      negative: 3,
    },
    keyTopics: ["Project Scope", "Timeline", "Budget Allocation", "Team Structure", "Risk Management"],
    entities: ["Project Alpha", "Sarah Johnson", "Development Team", "Q1 2024"],
    readability: 65,
    language: "English",
    lastModified: "2024-01-12",
  },
  "3": {
    name: "Meeting Notes.txt",
    type: "TXT",
    uploadDate: "2024-01-13",
    summary: "Notes from team meeting discussing project progress, blockers, and action items for next sprint.",
    wordCount: 892,
    pageCount: 3,
    readingTime: "4 minutes",
    sentiment: {
      positive: 55,
      neutral: 40,
      negative: 5,
    },
    keyTopics: ["Sprint Planning", "Bug Fixes", "Feature Development", "Team Coordination"],
    entities: ["Development Team", "Sprint 12", "Bug Tracker", "January 2024"],
    readability: 58,
    language: "English",
    lastModified: "2024-01-13",
  },
  "4": {
    name: "Annual Budget.pdf",
    type: "PDF",
    uploadDate: "2024-01-12",
    summary: "Annual budget report detailing financial allocations across departments and projected expenses.",
    wordCount: 5120,
    pageCount: 32,
    readingTime: "20 minutes",
    sentiment: {
      positive: 60,
      neutral: 35,
      negative: 5,
    },
    keyTopics: ["Budget Planning", "Department Allocations", "Cost Reduction", "Investment Strategy"],
    entities: ["Finance Department", "HR Department", "Marketing Team", "2024 Fiscal Year"],
    readability: 68,
    language: "English",
    lastModified: "2024-01-08",
  },
}

export function AnalysisResults({ documentId }: { documentId: string }) {
  const data = analysisData[documentId] || analysisData["1"]

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
                  Analyzed
                </Badge>
              </div>
              <CardTitle className="text-3xl">{data.name}</CardTitle>
              <CardDescription className="text-base">Analysis completed on {data.uploadDate}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed text-muted-foreground">{data.summary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-border/50 shadow-md transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Word Count</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <Hash className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.wordCount.toLocaleString()}</div>
            <p className="mt-1 text-sm text-muted-foreground">{data.pageCount} pages total</p>
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
            <div className="text-3xl font-bold">{data.readingTime}</div>
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
            <div className="text-3xl font-bold">{data.readability}%</div>
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
            <div className="text-3xl font-bold">{data.language}</div>
            <p className="mt-1 text-sm text-muted-foreground">{data.type} format</p>
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
              <span className="text-sm font-medium text-muted-foreground">{data.sentiment.positive}%</span>
            </div>
            <Progress value={data.sentiment.positive} className="h-3 bg-muted" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Neutral</span>
              <span className="text-sm font-medium text-muted-foreground">{data.sentiment.neutral}%</span>
            </div>
            <Progress value={data.sentiment.neutral} className="h-3 bg-muted" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Negative</span>
              <span className="text-sm font-medium text-muted-foreground">{data.sentiment.negative}%</span>
            </div>
            <Progress value={data.sentiment.negative} className="h-3 bg-muted" />
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
            <div className="flex flex-wrap gap-2">
              {data.keyTopics.map((topic: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-4 py-2 text-sm font-medium">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/50 shadow-lg">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
            <CardTitle className="text-xl">Named Entities</CardTitle>
            <CardDescription>Important names, dates, and organizations</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {data.entities.map((entity: string, index: number) => (
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
          </CardContent>
        </Card>
      </div>

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
                <p className="font-semibold">{data.uploadDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Modified</p>
                <p className="font-semibold">{data.lastModified}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">File Type</p>
                <p className="font-semibold">{data.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                <AlertCircle className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pages</p>
                <p className="font-semibold">{data.pageCount} pages</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
