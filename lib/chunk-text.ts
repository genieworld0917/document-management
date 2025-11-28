const DEFAULT_CHUNK_SIZE = 800
const DEFAULT_CHUNK_OVERLAP = 80

export function chunkText(input: string, chunkSize = DEFAULT_CHUNK_SIZE, chunkOverlap = DEFAULT_CHUNK_OVERLAP) {
  if (!input) return []

  const chunks: string[] = []
  let start = 0

  while (start < input.length) {
    const end = Math.min(start + chunkSize, input.length)
    chunks.push(input.slice(start, end).trim())
    if (end === input.length) break
    start += chunkSize - chunkOverlap
  }

  return chunks.filter(Boolean)
}





