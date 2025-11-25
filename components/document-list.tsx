"use client"

import { FileText, Download, Eye, BarChart3, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"

const mockDocuments = [
  {
    id: 1,
    name: "Q4 Financial Report.pdf",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    status: "analyzed",
    type: "PDF",
  },
  {
    id: 2,
    name: "Project Proposal.docx",
    size: "856 KB",
    uploadDate: "2024-01-14",
    status: "analyzing",
    type: "DOCX",
  },
  {
    id: 3,
    name: "Meeting Notes.txt",
    size: "45 KB",
    uploadDate: "2024-01-13",
    status: "analyzed",
    type: "TXT",
  },
  {
    id: 4,
    name: "Annual Budget.pdf",
    size: "1.8 MB",
    uploadDate: "2024-01-12",
    status: "analyzed",
    type: "PDF",
  },
]

export function DocumentList() {
  const handleDownload = (doc: any) => {
    alert(`Would download: ${doc.name}`)
  }

  const handleView = (doc: any) => {
    alert(`Would view: ${doc.name}`)
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
        <div className="space-y-4">
          {mockDocuments.map((doc) => (
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
                    <h3 className="text-base font-semibold">{doc.name}</h3>
                    <Badge
                      variant={doc.status === "analyzed" ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        doc.status === "analyzed" && "bg-gradient-to-r from-accent/90 to-primary/90 text-white",
                      )}
                    >
                      {doc.status === "analyzed" ? "Analyzed" : "Analyzing..."}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                      <span>{doc.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                      <span>{doc.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{doc.uploadDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none bg-transparent"
                  onClick={() => handleView(doc)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Link href={`/documents/${doc.id}/analyze`} className="flex-1 sm:flex-none">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    disabled={doc.status !== "analyzed"}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analyze
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-accent to-primary sm:flex-none"
                  onClick={() => handleDownload(doc)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
