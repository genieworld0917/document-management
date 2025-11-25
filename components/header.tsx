import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight">DocuFlow</span>
            <span className="text-xs text-muted-foreground">Document Intelligence</span>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Dashboard
          </Button>
          <Button variant="ghost" className="hidden sm:inline-flex">
            Settings
          </Button>
          <Button className="bg-gradient-to-r from-accent to-primary">Get Started</Button>
        </nav>
      </div>
    </header>
  )
}
