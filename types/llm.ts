export interface LLMProcessRequest {
  prompt: string
}

export interface LLMProcessResponse {
  originalPrompt: string
  response: string
  metadata: {
    model: string
    tokenCount: {
      input: number
      output: number
    }
    processingTime: number
  }
}

export interface LLMErrorResponse {
  error: string
  details?: string
}