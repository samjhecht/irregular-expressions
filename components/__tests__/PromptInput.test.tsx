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

    // Create a string longer than 1000 characters and paste it for better performance
    const longText = 'a'.repeat(1001)
    await user.click(textarea)
    await user.paste(longText)
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

  it('submits form with Ctrl+Enter keyboard shortcut', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      originalPrompt: 'Keyboard shortcut test',
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

    await user.type(textarea, 'Keyboard shortcut test')
    await user.keyboard('{Control>}{Enter}{/Control}')

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/llm/process-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Keyboard shortcut test' })
      })
      expect(mockOnPromptProcessed).toHaveBeenCalledWith(mockResponse)
    })
  })

  it('submits form with Cmd+Enter keyboard shortcut on Mac', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      originalPrompt: 'Mac shortcut test',
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

    await user.type(textarea, 'Mac shortcut test')
    await user.keyboard('{Meta>}{Enter}{/Meta}')

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/llm/process-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Mac shortcut test' })
      })
      expect(mockOnPromptProcessed).toHaveBeenCalledWith(mockResponse)
    })
  })

  it('disables textarea when disabled prop is true', async () => {
    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
        disabled={true}
      />
    )

    const textarea = screen.getByPlaceholderText(/Enter your prompt here/)
    
    // The textarea should definitely be disabled
    expect(textarea).toBeDisabled()
    
    // The component should not be functionally interactive even if some elements 
    // don't show disabled state due to Chakra UI behavior
  })

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup()
    
    // Mock a delayed response to test loading state
    ;(fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({
            originalPrompt: 'Test prompt',
            response: 'AI response',
            metadata: {
              model: 'claude-3-haiku',
              tokenCount: { input: 10, output: 20 },
              processingTime: 1000
            }
          })
        }), 100)
      )
    )

    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
      />
    )

    const textarea = screen.getByPlaceholderText(/Enter your prompt here/)
    const submitButton = screen.getByText('Process Prompt')

    await user.type(textarea, 'Valid prompt for testing loading state')
    await user.click(submitButton)

    // During submission, should show loading text
    expect(textarea).toBeDisabled()
    expect(screen.getByText('Processing...')).toBeInTheDocument()

    // Wait for submission to complete
    await waitFor(() => {
      expect(mockOnPromptProcessed).toHaveBeenCalled()
    })

    // After completion, elements should be enabled again
    expect(textarea).not.toBeDisabled()
  })

  it('shows minimum character warning at exact minimum length', async () => {
    const user = userEvent.setup()
    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
      />
    )

    const textarea = screen.getByPlaceholderText(/Enter your prompt here/)

    // Type exactly 9 characters (one less than minimum)
    await user.type(textarea, 'exactly 9')
    expect(screen.getByText('(minimum 10)')).toBeInTheDocument()

    // Add one more character to reach minimum
    await user.type(textarea, '!')
    expect(screen.queryByText('(minimum 10)')).not.toBeInTheDocument()
  })

  it('shows character count at exact maximum length', async () => {
    const user = userEvent.setup()
    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
      />
    )

    const textarea = screen.getByPlaceholderText(/Enter your prompt here/)

    // Type exactly 1000 characters (maximum allowed)
    const exactMaxText = 'a'.repeat(1000)
    await user.click(textarea)
    await user.paste(exactMaxText)

    expect(screen.getByText('1000/1000 characters')).toBeInTheDocument()
    
    // Submit button should be enabled at max length
    const submitButton = screen.getByText('Process Prompt')
    expect(submitButton).not.toBeDisabled()
  })

  it('shows validation error when exceeding maximum length', async () => {
    const user = userEvent.setup()
    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
      />
    )

    const textarea = screen.getByPlaceholderText(/Enter your prompt here/)
    const submitButton = screen.getByText('Process Prompt')

    // Type more than 1000 characters
    const tooLongText = 'a'.repeat(1001)
    await user.click(textarea)
    await user.paste(tooLongText)

    expect(screen.getByText('1001/1000 characters')).toBeInTheDocument()

    // Try to submit and check for validation error
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Prompt must be less than 1000 characters')).toBeInTheDocument()
    })
  })

  it('shows validation behavior with empty input', async () => {
    const user = userEvent.setup()
    render(
      <MockedPromptInput
        onPromptProcessed={mockOnPromptProcessed}
        onError={mockOnError}
      />
    )

    const textarea = screen.getByPlaceholderText(/Enter your prompt here/)
    const submitButton = screen.getByText('Process Prompt')

    // Character count should show 0
    expect(screen.getByText('0/1000 characters')).toBeInTheDocument()
    expect(screen.getByText('(minimum 10)')).toBeInTheDocument()

    // Type something then delete it all
    await user.type(textarea, 'temporary text')
    await user.clear(textarea)

    // Should show empty state again
    expect(screen.getByText('0/1000 characters')).toBeInTheDocument()
    expect(screen.getByText('(minimum 10)')).toBeInTheDocument()

    // Try to submit empty form
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Prompt is required')).toBeInTheDocument()
    })
  })
})