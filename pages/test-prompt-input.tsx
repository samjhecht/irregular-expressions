import React, { useState } from 'react'
import { Box, Text, VStack, Container, useColorModeValue } from '@chakra-ui/react'
import PromptInput from '../components/PromptInput'
import { LLMProcessResponse } from '../types/llm'

/**
 * Test page for the PromptInput component.
 * This demonstrates the component functionality and integration.
 */
const TestPromptInputPage: React.FC = () => {
  const [response, setResponse] = useState<LLMProcessResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const bgColor = useColorModeValue('gray.50', 'gray.900')

  const handlePromptProcessed = (data: LLMProcessResponse) => {
    setResponse(data)
    setError(null)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setResponse(null)
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" mb={4}>
            LLM Prompt Input Test
          </Text>
          <Text fontSize="lg" color="gray.600">
            Test the interactive prompt input component
          </Text>
        </Box>

        <PromptInput
          onPromptProcessed={handlePromptProcessed}
          onError={handleError}
        />

        {error && (
          <Box
            bg="red.50"
            borderColor="red.200"
            border="1px"
            borderRadius="md"
            p={4}
          >
            <Text color="red.700" fontWeight="bold" mb={2}>
              Error:
            </Text>
            <Text color="red.600">{error}</Text>
          </Box>
        )}

        {response && (
          <Box
            bg={bgColor}
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={6}
          >
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Response:
            </Text>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={2}>Original Prompt:</Text>
                <Text bg="white" p={3} borderRadius="md" border="1px" borderColor="gray.200">
                  {response.originalPrompt}
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>AI Response:</Text>
                <Text bg="white" p={3} borderRadius="md" border="1px" borderColor="gray.200" whiteSpace="pre-wrap">
                  {response.response}
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>Metadata:</Text>
                <Box bg="white" p={3} borderRadius="md" border="1px" borderColor="gray.200">
                  <Text>Model: {response.metadata.model}</Text>
                  <Text>Input Tokens: {response.metadata.tokenCount.input}</Text>
                  <Text>Output Tokens: {response.metadata.tokenCount.output}</Text>
                  <Text>Processing Time: {response.metadata.processingTime}ms</Text>
                </Box>
              </Box>
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  )
}

export default TestPromptInputPage