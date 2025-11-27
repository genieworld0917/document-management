export type ChatRole = "user" | "assistant"

export type ChatMessage = {
  role: ChatRole
  content: string
}

export type ChatSource = {
  chunkIndex: number
  text: string
  score?: number | null
}


