import { DocumentUpload } from "@/components/document-upload"
import { DocumentList } from "@/components/document-list"
import { Header } from "@/components/header"
import { Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Document Intelligence
          </div>
          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Transform Your
            <span className="bg-gradient-to-r from-accent via-accent to-primary bg-clip-text text-transparent">
              {" "}
              Documents{" "}
            </span>
            Into Insights
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Upload, analyze, and extract valuable insights from your documents with our intelligent platform. Experience
            seamless document management powered by advanced AI.
          </p>
        </div>

        <div className="space-y-16">
          <DocumentUpload />
          <DocumentList />
        </div>
      </main>
    </div>
  )
}
