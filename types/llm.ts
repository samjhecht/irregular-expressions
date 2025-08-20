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

// LLM Lifecycle Data Model Types

export interface RealDataExample {
  inputData: unknown
  outputData: unknown
  explanation: string
  dataType: 'tokens' | 'embeddings' | 'attention' | 'probabilities' | 'text'
}

export interface VisualizationConfig {
  type: 'flow' | 'matrix' | 'graph' | 'sequence' | 'tree'
  d3Config?: Record<string, unknown>
  interactive?: boolean
}

export interface LLMStep {
  id: string
  title: string
  description: string
  order: number
  expandable: boolean
  subSteps?: LLMStep[]
  realDataExample?: RealDataExample
  visualization?: VisualizationConfig
  status?: 'pending' | 'active' | 'completed'
  duration?: number // estimated duration in ms for animations
}

export interface LLMLifecycle {
  steps: LLMStep[]
  currentStepId?: string
  userInput?: string
  generatedExamples?: Map<string, RealDataExample>
  totalSteps: number
  completedSteps: number
}

export interface StepNavigationResult {
  success: boolean
  step?: LLMStep
  error?: string
}

export interface ExampleGenerationRequest {
  stepId: string
  userInput: string
  previousStepData?: unknown
}

export interface ExampleGenerationResult {
  success: boolean
  example?: RealDataExample
  error?: string
}