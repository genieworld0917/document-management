"use client"

import { FormEvent, useMemo, useState } from "react"
import { Loader2, MessageSquare, ShieldCheck, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import type { ChatMessage, ChatSource } from "@/types/chat"

type ConversationMessage = ChatMessage & {
  id: string
  sources?: ChatSource[]
}

type DocumentChatProps = {
  documentId: string
  documentName: string
  summary?: string | null
}

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function DocumentChat({ documentId, documentName, summary }: DocumentChatProps) {
  const introMessage = useMemo<ConversationMessage>(() => {
    const intro =
      summary ??
      `I'm ready to discuss "${documentName}". Ask questions about its contents, key themes, or request targeted insights.`

    return {
      id: createId(),
      role: "assistant",
      content: intro,
    }
  }, [documentName, summary])

  const [messages, setMessages] = useState<ConversationMessage[]>([introMessage])
  const [inputValue, setInputValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || isSubmitting) return

    const userMessage: ConversationMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/documents/${documentId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate response")
      }

      const data = await response.json()

      const assistantMessage: ConversationMessage = {
        id: createId(),
        role: "assistant",
        content: data.message?.content ?? "I could not generate a response.",
        sources: data.sources ?? [],
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error(error)
      toast({
        title: "Chat unavailable",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl">Ask About This Document</CardTitle>
              <CardDescription>
                Chat with an AI assistant grounded in the analyzed content of {documentName}
              </CardDescription>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-1 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Context-aware responses
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          <ScrollArea className="h-[420px] rounded-xl border border-border/40 bg-muted/20 p-4">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col gap-3 rounded-2xl border border-border/40 bg-background/80 p-4 ${
                    message.role === "assistant" ? "shadow-sm shadow-primary/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    {message.role === "assistant" ? (
                      <>
                        <MessageSquare className="h-4 w-4 text-accent" />
                        Assistant
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 text-primary" />
                        You
                      </>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{message.content}</p>
                  {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                    <div className="rounded-xl border border-border/40 bg-muted/30 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Referenced chunks</p>
                      <div className="mt-2 space-y-2 text-xs text-muted-foreground">
                        {message.sources.map((source, index) => (
                          <div key={`${message.id}-source-${index}`} className="rounded-lg bg-background/80 p-2">
                            <p className="text-xs font-semibold text-foreground">Chunk #{source.chunkIndex}</p>
                            <p className="text-xs text-muted-foreground">{source.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={`Ask something about "${documentName}"...`}
              className="min-h-[120px] resize-none border-border/60 bg-background/80"
            />
            <div className="flex items-center justify-end gap-3">
              <p className="text-xs text-muted-foreground">Responses cite the most relevant document excerpts.</p>
              <Button type="submit" disabled={isSubmitting || !inputValue.trim()} className="min-w-[140px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Ask
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


