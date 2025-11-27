import { Pinecone } from "@pinecone-database/pinecone"

let pineconeClient: Pinecone | null = null

const missingEnvMessage = "Pinecone configuration missing. Set PINECONE_API_KEY and PINECONE_INDEX."

export function getPineconeClient() {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error(missingEnvMessage)
  }

  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    })
  }

  return pineconeClient
}

export function getPineconeIndex() {
  const client = getPineconeClient()
  const indexName = process.env.PINECONE_INDEX

  if (!indexName) {
    throw new Error(missingEnvMessage)
  }

  return client.index(indexName)
}

