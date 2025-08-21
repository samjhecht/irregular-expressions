import * as React from 'react'
import {
  Box,
  Button,
  Textarea,
  Text,
  VStack,
  HStack,
  FormControl,
  FormErrorMessage,
  useToast,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Formik, Field } from 'formik'
import { LLM_CONFIG } from '../config/llm'
import { LLMProcessResponse, LLMErrorResponse } from '../types/llm'

interface PromptInputProps {
  onPromptProcessed: (data: LLMProcessResponse) => void
  onError: (error: string) => void
  disabled?: boolean
}

const EXAMPLE_PROMPTS = [
  "Explain how photosynthesis works",
  "Write a short story about a robot",
  "Compare TypeScript and JavaScript",
  "Create a simple recipe for chocolate cake"
]

const MIN_PROMPT_LENGTH = 10

/**
 * Interactive prompt input component for LLM processing.
 * 
 * Features:
 * - Multi-line textarea input with validation
 * - Character count display
 * - Example prompts dropdown
 * - Loading states and error handling
 * - Keyboard shortcuts (Ctrl+Enter to submit)
 * - Responsive design with dark/light mode support
 * 
 * @example
 * ```tsx
 * <PromptInput
 *   onPromptProcessed={(response) => console.log(response)}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
const PromptInput: React.FC<PromptInputProps> = ({
  onPromptProcessed,
  onError,
  disabled = false
}) => {
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleSubmit = async (
    values: { prompt: string }, 
    { setSubmitting, setStatus }: { 
      setSubmitting: (submitting: boolean) => void; 
      setStatus: (status: { error?: string } | null) => void 
    }
  ) => {
    setStatus(null)

    try {
      const response = await fetch('/api/llm/process-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: values.prompt
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data as LLMErrorResponse
        onError(errorData.error)
        setStatus({ error: errorData.error })
        return
      }

      const successData = data as LLMProcessResponse
      onPromptProcessed(successData)
      
      toast({
        title: 'Success!',
        description: 'Your prompt has been processed.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again later.'
      onError(errorMessage)
      setStatus({ error: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  const validatePrompt = (value: string) => {
    if (!value || value.trim().length === 0) {
      return 'Prompt is required'
    }
    if (value.length < MIN_PROMPT_LENGTH) {
      return `Prompt must be at least ${MIN_PROMPT_LENGTH} characters`
    }
    if (value.length > LLM_CONFIG.MAX_PROMPT_LENGTH) {
      return `Prompt must be less than ${LLM_CONFIG.MAX_PROMPT_LENGTH} characters`
    }
    return undefined
  }

  return (
    <Box
      bg={bgColor}
      p={6}
      rounded="md"
      border="1px"
      borderColor={borderColor}
      w="100%"
      maxW="800px"
      mx="auto"
    >
      <Formik
        initialValues={{ prompt: '' }}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, errors, touched, status, isSubmitting, values, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" align="center">
                <Text fontSize="xl" fontWeight="bold">
                  Enter Your Prompt
                </Text>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="outline"
                    size="sm"
                    disabled={disabled || isSubmitting}
                  >
                    Examples
                  </MenuButton>
                  <MenuList>
                    {EXAMPLE_PROMPTS.map((prompt, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => setFieldValue('prompt', prompt)}
                      >
                        {prompt}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </HStack>

              <FormControl isInvalid={!!errors.prompt && touched.prompt}>
                <Field
                  as={Textarea}
                  name="prompt"
                  placeholder="Enter your prompt here... (e.g., 'Explain quantum computing in simple terms')"
                  minH="120px"
                  resize="vertical"
                  disabled={disabled || isSubmitting}
                  validate={validatePrompt}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                />
                <FormErrorMessage>{errors.prompt}</FormErrorMessage>
              </FormControl>

              <HStack justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500">
                  {values.prompt.length}/{LLM_CONFIG.MAX_PROMPT_LENGTH} characters
                  {values.prompt.length < MIN_PROMPT_LENGTH && (
                    <Text as="span" color="orange.500" ml={2}>
                      (minimum {MIN_PROMPT_LENGTH})
                    </Text>
                  )}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Press Ctrl+Enter to submit
                </Text>
              </HStack>

              {status && status.error && (
                <Text color="red.500" fontSize="sm">
                  {status.error}
                </Text>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={isSubmitting}
                disabled={disabled || !!validatePrompt(values.prompt)}
                loadingText="Processing..."
              >
                Process Prompt
              </Button>
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  )
}

export default PromptInput