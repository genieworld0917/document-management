import OpenAI from "openai"

let openAIClient: OpenAI | null = null

const missingKeyMessage = "OPENAI_API_KEY is not configured. Set it in your environment to enable analysis."

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(missingKeyMessage)
  }

  if (!openAIClient) {
    openAIClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  return openAIClient
}

export function getDefaultCompletionModel() {
  return process.env.OPENAI_MODEL || "gpt-4.1-mini"
}

export function getDefaultEmbeddingModel() {
  return process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small"
}

import OpenAI from "openai"

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.warn("OPENAI_API_KEY is not set. Analysis features will be disabled.")
}

export const openai = new OpenAI({
  apiKey,
})

export const DEFAULT_ANALYSIS_MODEL = process.env.OPENAI_ANALYSIS_MODEL ?? "gpt-4o-mini"
export const DEFAULT_EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-large"


