// Core lifecycle management
export { LLMLifecycleManager, createDefaultLifecycle, getDefaultLLMSteps } from './lifecycle'

// Example generation
export { ExampleGenerator, generateExampleForRequest } from './examples'

// Utility functions
export {
  validateStepStructure,
  validateLifecycleStructure,
  getAllStepIds,
  getStepDepth,
  getStepPath,
  getParentStep,
  getSiblingSteps,
  getStepsByStatus,
  cloneStep,
  cloneLifecycle,
  mergeVisualizationConfigs,
  calculateTotalDuration,
  getNextStepId,
  getPreviousStepId,
  flattenSteps,
  createStepSummary,
  searchSteps,
  exportLifecycleToJSON,
  importLifecycleFromJSON
} from './utils'

// Re-export types for convenience
export type {
  LLMStep,
  LLMLifecycle,
  RealDataExample,
  VisualizationConfig,
  StepNavigationResult,
  ExampleGenerationRequest,
  ExampleGenerationResult
} from '../../types/llm'