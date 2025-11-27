"use client"

import type React from "react"

import { useState } from "react"
import { useSWRConfig } from "swr"

import { Upload, File, X, Sparkles, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DOCUMENTS_API_PATH } from "@/lib/constants"
import { useToast } from "@/hooks/use-toast"

export function DocumentUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { mutate } = useSWRConfig()
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || isUploading) {
      return
    }

    setIsUploading(true)
    try {
      const payload = {
        documents: selectedFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          storageKey: createStorageKey(file.name),
        })),
      }

      const response = await fetch(DOCUMENTS_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      toast({
        title: "Upload queued",
        description: `Added ${selectedFiles.length} ${selectedFiles.length === 1 ? "document" : "documents"} to the queue.`,
      })
      setSelectedFiles([])
      mutate(DOCUMENTS_API_PATH)
    } catch (error) {
      console.error(error)
      toast({
        title: "Upload failed",
        description: "We could not upload your documents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="overflow-hidden border-border/50 shadow-lg shadow-primary/5">
      <CardHeader className="border-b border-border/50 bg-gradient-to-br from-card via-card to-muted/20">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <Upload className="h-4 w-4 text-accent" />
          </div>
          <div>
            <CardTitle className="text-2xl">Upload Documents</CardTitle>
            <CardDescription className="mt-1">
              Drag and drop your documents or click to browse • PDF, DOC, DOCX, TXT
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div
            className={cn(
              "group relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200",
              isDragging
                ? "scale-[1.02] border-accent bg-accent/5 shadow-lg shadow-accent/20"
                : "border-border/70 bg-gradient-to-br from-muted/30 via-muted/20 to-background hover:border-accent/50 hover:bg-muted/40 hover:shadow-md",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <div
              className={cn(
                "mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br transition-all duration-200",
                isDragging
                  ? "from-accent to-primary shadow-lg shadow-accent/30"
                  : "from-muted to-muted/50 group-hover:from-accent/20 group-hover:to-primary/20",
              )}
            >
              <Upload
                className={cn("h-9 w-9 transition-colors", isDragging ? "text-white" : "text-muted-foreground")}
              />
            </div>
            <p className="mb-2 text-xl font-semibold">Drop your files here</p>
            <p className="text-sm text-muted-foreground">or click to browse from your computer</p>
            <div className="mt-6 flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">AI-powered analysis ready</span>
            </div>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Selected Files <span className="text-muted-foreground">({selectedFiles.length})</span>
                </h3>
              </div>
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-4 shadow-sm transition-all hover:border-accent/30 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <File className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-60 transition-opacity hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-accent to-primary text-base shadow-lg shadow-accent/20"
                size="lg"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Upload className="mr-2 h-5 w-5" />}
                {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? "File" : "Files"}`}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const createStorageKey = (filename: string) => {
  const uniqueSuffix = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now().toString(36)
  return `${uniqueSuffix}-${filename}`
}
