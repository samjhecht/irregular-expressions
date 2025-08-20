import { NextApiRequest, NextApiResponse } from 'next'
import Anthropic from '@anthropic-ai/sdk'
import { LLMProcessRequest, LLMProcessResponse, LLMErrorResponse } from '../../../types/llm'

const MAX_PROMPT_LENGTH = 4000
const DEFAULT_MODEL = 'claude-3-haiku-20240307'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LLMProcessResponse | LLMErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt }: LLMProcessRequest = req.body

    // Input validation
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    if (typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt must be a string' })
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({ 
        error: `Prompt too long. Maximum length is ${MAX_PROMPT_LENGTH} characters` 
      })
    }

    if (prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt cannot be empty' })
    }

    // Environment variable validation
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'ANTHROPIC_API_KEY not configured'
      })
    }

    const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey,
    })

    const startTime = Date.now()

    // Make API call to Anthropic
    const response = await anthropic.messages.create({
      model,
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const processingTime = Date.now() - startTime

    // Extract response text
    const responseText = response.content
      .filter((block) => block.type === 'text')
      .map((block) => {
        if (block.type === 'text') {
          return block.text
        }
        return ''
      })
      .join('')

    // Get token usage information
    const inputTokens = response.usage.input_tokens
    const outputTokens = response.usage.output_tokens

    const result: LLMProcessResponse = {
      originalPrompt: prompt,
      response: responseText,
      metadata: {
        model,
        tokenCount: {
          input: inputTokens,
          output: outputTokens
        },
        processingTime
      }
    }

    return res.status(200).json(result)

  } catch (error: unknown) {
    console.error('LLM API Error:', error)
    
    if (error instanceof Anthropic.APIError) {
      return res.status(error.status || 500).json({
        error: 'API request failed',
        details: error.message
      })
    }

    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}