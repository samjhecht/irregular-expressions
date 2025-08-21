import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider } from '@chakra-ui/react'
import PromptInput from '../PromptInput'
import theme from '../../src/theme'

// Mock the config
jest.mock('../../config/llm', () => ({
  LLM_CONFIG: {
    MAX_PROMPT_LENGTH: 1000,
  }
}))

// Mock fetch
global.fetch = jest.fn()

interface MockedPromptInputProps {
  onPromptProcessed: (data: unknown) => void
  onError: (error: string) => void
  disabled?: boolean
}

const MockedPromptInput = (props: MockedPromptInputProps) => (
  <ChakraProvider theme={theme}>
    <PromptInput {...props} />
  </ChakraProvider>
)

describe('PromptInput', () => {
  const mockOnPromptProcessed = jest.fn()
  const mockOnError = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  it('renders correctly', () => {
    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
      />
    )

    expect(screen.getByText('Enter Your Prompt')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Enter your prompt here/)).toBeInTheDocument()
    expect(screen.getByText('Examples')).toBeInTheDocument()
    expect(screen.getByText('Process Prompt')).toBeInTheDocument()
  })

  it('shows character count', async () => {
    const user = userEvent.setup()
    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
      />
    )

    const textarea = screen.getByPlaceholderText(/Enter your prompt here/)
    await user.type(textarea, 'Hello world')

    expect(screen.getByText('11/1000 characters')).toBeInTheDocument()
  })

  it('validates minimum length', async () => {
    const user = userEvent.setup()
    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
      />
    )

    const textarea = screen.getByPlaceholderText(/Enter your prompt here/)
    const submitButton = screen.getByText('Process Prompt')

    await user.type(textarea, 'short')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Prompt must be at least 10 characters')).toBeInTheDocument()
    })
  })

  it('validates maximum length', async () => {
    const user = userEvent.setup()
    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
      />
    )

    const textarea = screen.getByPlaceholderText(/Enter your prompt here/)
    const submitButton = screen.getByText('Process Prompt')

    // Create a string longer than 1000 characters
    const longText = 'a'.repeat(1001)
    await user.type(textarea, longText)
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Prompt must be less than 1000 characters')).toBeInTheDocument()
    })
  })

  it('submits valid prompt successfully', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      originalPrompt: 'Valid prompt here',
      response: 'AI response',
      metadata: {
        model: 'claude-3-haiku',
        tokenCount: { input: 10, output: 20 },
        processingTime: 1000
      }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
      />
    )

    const textarea = screen.getByPlaceholderText(/Enter your prompt here/)
    const submitButton = screen.getByText('Process Prompt')

    await user.type(textarea, 'Valid prompt here for testing')
    await user.click(submitButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/llm/process-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Valid prompt here for testing' })
      })
      expect(mockOnPromptProcessed).toHaveBeenCalledWith(mockResponse)
    })
  })

  it('handles API error', async () => {
    const user = userEvent.setup()
    const errorResponse = { error: 'API Error' }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => errorResponse
    })

    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
      />
    )

    const textarea = screen.getByPlaceholderText(/Enter your prompt here/)
    const submitButton = screen.getByText('Process Prompt')

    await user.type(textarea, 'Valid prompt here for testing')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('API Error')
    })
  })

  it('inserts example prompts', async () => {
    const user = userEvent.setup()
    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
      />
    )

    const examplesButton = screen.getByRole('button', { name: /examples/i })
    await user.click(examplesButton)

    await waitFor(() => {
      expect(screen.getByText('Explain how photosynthesis works')).toBeInTheDocument()
    })

    const exampleOption = screen.getByText('Explain how photosynthesis works')
    await user.click(exampleOption)

    const textarea = screen.getByPlaceholderText(/Enter your prompt here/)
    expect(textarea).toHaveValue('Explain how photosynthesis works')
  })
})