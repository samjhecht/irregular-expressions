import { createMocks } from 'node-mocks-http'
import { LLM_CONFIG } from '../../../config/llm'

const mockAnthropicResponse = {
  content: [
    {
      type: 'text',
      text: 'This is a test response from Claude'
    }
  ],
  usage: {
    input_tokens: 10,
    output_tokens: 20
  }
}

// Mock Anthropic SDK
const mockMessagesCreate = jest.fn()

jest.mock('@anthropic-ai/sdk', () => {
  const MockAPIError = class extends Error {
    constructor(message: string, public status?: number) {
      super(message)
      this.name = 'APIError'
    }
  }

  const mockAnthropicConstructor = jest.fn(() => ({
    messages: {
      create: mockMessagesCreate
    }
  }))

  return {
    __esModule: true,
    default: mockAnthropicConstructor,
    APIError: MockAPIError
  }
})

import handler from '../../../pages/api/llm/process-prompt'

// Set up environment variables for tests
const originalEnv = process.env

beforeEach(() => {
  jest.clearAllMocks()
  mockMessagesCreate.mockResolvedValue(mockAnthropicResponse)
  process.env = {
    ...originalEnv,
    ANTHROPIC_API_KEY: 'test-api-key'
  }
})

afterAll(() => {
  process.env = originalEnv
})

describe('/api/llm/process-prompt', () => {
  it('should handle POST request successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        prompt: 'Test prompt'
      }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data).toHaveProperty('originalPrompt', 'Test prompt')
    expect(data).toHaveProperty('response', 'This is a test response from Claude')
    expect(data).toHaveProperty('metadata')
    expect(data.metadata).toHaveProperty('tokenCount')
    expect(data.metadata.tokenCount).toEqual({
      input: 10,
      output: 20
    })
  })

  it('should reject non-POST methods', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(405)
    const data = JSON.parse(res._getData())
    expect(data).toEqual({ error: 'Method not allowed' })
  })

  it('should reject empty prompt', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {}
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(400)
    const data = JSON.parse(res._getData())
    expect(data).toEqual({ error: 'Prompt is required' })
  })

  it('should reject non-string prompt', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        prompt: 123
      }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(400)
    const data = JSON.parse(res._getData())
    expect(data).toEqual({ error: 'Prompt must be a string' })
  })

  it('should reject prompt that is too long', async () => {
    const longPrompt = 'a'.repeat(LLM_CONFIG.MAX_PROMPT_LENGTH + 1)
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        prompt: longPrompt
      }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(400)
    const data = JSON.parse(res._getData())
    expect(data).toEqual({
      error: `Prompt too long. Maximum length is ${LLM_CONFIG.MAX_PROMPT_LENGTH} characters`
    })
  })

  it('should reject empty/whitespace-only prompt', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        prompt: '   '
      }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(400)
    const data = JSON.parse(res._getData())
    expect(data).toEqual({ error: 'Prompt cannot be empty' })
  })

  it('should handle missing API key', async () => {
    delete process.env.ANTHROPIC_API_KEY

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        prompt: 'Test prompt'
      }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(500)
    const data = JSON.parse(res._getData())
    expect(data).toEqual({
      error: 'Server configuration error',
      details: 'ANTHROPIC_API_KEY not configured'
    })
  })

  // TODO: Fix APIError mocking in future
  // it('should handle Anthropic API errors', async () => {
  //   const apiError = new Anthropic.APIError('API request failed', 429)
  //   mockMessagesCreate.mockRejectedValueOnce(apiError)

  //   const { req, res } = createMocks({
  //     method: 'POST',
  //     body: {
  //       prompt: 'Test prompt'
  //     }
  //   })

  //   await handler(req, res)

  //   expect(res._getStatusCode()).toBe(429)
  //   const data = JSON.parse(res._getData())
  //   expect(data).toEqual({
  //     error: 'API request failed',
  //     details: 'API request failed'
  //   })
  // })

  // it('should handle unexpected errors', async () => {
  //   mockMessagesCreate.mockRejectedValueOnce(new Error('Unexpected error'))

  //   const { req, res } = createMocks({
  //     method: 'POST',
  //     body: {
  //       prompt: 'Test prompt'
  //     }
  //   })

  //   await handler(req, res)

  //   expect(res._getStatusCode()).toBe(500)
  //   const data = JSON.parse(res._getData())
  //   expect(data).toEqual({
  //     error: 'Internal server error',
  //     details: 'Unexpected error'
  //   })
  // })

  it('should use configuration values correctly', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        prompt: 'Test prompt'
      }
    })

    await handler(req, res)

    expect(mockMessagesCreate).toHaveBeenCalledWith({
      model: LLM_CONFIG.DEFAULT_MODEL,
      max_tokens: LLM_CONFIG.MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: 'Test prompt'
        }
      ]
    })
  })
})