import { LLMStep, LLMLifecycle, VisualizationConfig } from '../../types/llm'

export function validateStepStructure(step: LLMStep): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!step.id || typeof step.id !== 'string') {
    errors.push('Step must have a valid string id')
  }

  if (!step.title || typeof step.title !== 'string') {
    errors.push('Step must have a valid string title')
  }

  if (!step.description || typeof step.description !== 'string') {
    errors.push('Step must have a valid string description')
  }

  if (typeof step.order !== 'number' || step.order < 1) {
    errors.push('Step order must be a positive number')
  }

  if (typeof step.expandable !== 'boolean') {
    errors.push('Step expandable must be a boolean')
  }

  if (step.subSteps) {
    if (!Array.isArray(step.subSteps)) {
      errors.push('SubSteps must be an array')
    } else {
      step.subSteps.forEach((subStep, index) => {
        const subStepValidation = validateStepStructure(subStep)
        if (!subStepValidation.isValid) {
          errors.push(`SubStep ${index}: ${subStepValidation.errors.join(', ')}`)
        }
      })
    }
  }

  if (step.status && !['pending', 'active', 'completed'].includes(step.status)) {
    errors.push('Step status must be one of: pending, active, completed')
  }

  if (step.duration && (typeof step.duration !== 'number' || step.duration < 0)) {
    errors.push('Step duration must be a non-negative number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateLifecycleStructure(lifecycle: LLMLifecycle): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!Array.isArray(lifecycle.steps)) {
    errors.push('Lifecycle must have a steps array')
    return { isValid: false, errors }
  }

  if (lifecycle.steps.length === 0) {
    errors.push('Lifecycle must have at least one step')
  }

  lifecycle.steps.forEach((step, index) => {
    const stepValidation = validateStepStructure(step)
    if (!stepValidation.isValid) {
      errors.push(`Step ${index}: ${stepValidation.errors.join(', ')}`)
    }
  })

  // Check for duplicate step IDs
  const stepIds = getAllStepIds(lifecycle.steps)
  const uniqueIds = new Set(stepIds)
  if (stepIds.length !== uniqueIds.size) {
    errors.push('Duplicate step IDs found in lifecycle')
  }

  // Validate step ordering
  const mainStepOrders = lifecycle.steps.map(step => step.order)
  const sortedOrders = [...mainStepOrders].sort((a, b) => a - b)
  if (JSON.stringify(mainStepOrders) !== JSON.stringify(sortedOrders)) {
    errors.push('Main steps are not properly ordered')
  }

  if (typeof lifecycle.totalSteps !== 'number' || lifecycle.totalSteps < 0) {
    errors.push('totalSteps must be a non-negative number')
  }

  if (typeof lifecycle.completedSteps !== 'number' || lifecycle.completedSteps < 0) {
    errors.push('completedSteps must be a non-negative number')
  }

  if (lifecycle.completedSteps > lifecycle.totalSteps) {
    errors.push('completedSteps cannot exceed totalSteps')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function getAllStepIds(steps: LLMStep[]): string[] {
  const ids: string[] = []
  for (const step of steps) {
    ids.push(step.id)
    if (step.subSteps) {
      ids.push(...getAllStepIds(step.subSteps))
    }
  }
  return ids
}

export function getStepDepth(stepId: string, steps: LLMStep[], currentDepth = 0): number {
  for (const step of steps) {
    if (step.id === stepId) {
      return currentDepth
    }
    if (step.subSteps) {
      const depth = getStepDepth(stepId, step.subSteps, currentDepth + 1)
      if (depth !== -1) return depth
    }
  }
  return -1
}

export function getStepPath(stepId: string, steps: LLMStep[], path: string[] = []): string[] | null {
  for (const step of steps) {
    const currentPath = [...path, step.id]
    if (step.id === stepId) {
      return currentPath
    }
    if (step.subSteps) {
      const subPath = getStepPath(stepId, step.subSteps, currentPath)
      if (subPath) return subPath
    }
  }
  return null
}

export function getParentStep(stepId: string, steps: LLMStep[]): LLMStep | null {
  for (const step of steps) {
    if (step.subSteps) {
      if (step.subSteps.some(subStep => subStep.id === stepId)) {
        return step
      }
      const parentInSubSteps = getParentStep(stepId, step.subSteps)
      if (parentInSubSteps) return parentInSubSteps
    }
  }
  return null
}

export function getSiblingSteps(stepId: string, steps: LLMStep[]): LLMStep[] {
  // Check if it's a top-level step
  if (steps.some(step => step.id === stepId)) {
    return steps.filter(step => step.id !== stepId)
  }

  // Check sub-steps
  for (const step of steps) {
    if (step.subSteps && step.subSteps.some(subStep => subStep.id === stepId)) {
      return step.subSteps.filter(subStep => subStep.id !== stepId)
    }
    if (step.subSteps) {
      const siblings = getSiblingSteps(stepId, step.subSteps)
      if (siblings.length > 0) return siblings
    }
  }

  return []
}

export function getStepsByStatus(steps: LLMStep[], status: 'pending' | 'active' | 'completed'): LLMStep[] {
  const result: LLMStep[] = []
  for (const step of steps) {
    if (step.status === status) {
      result.push(step)
    }
    if (step.subSteps) {
      result.push(...getStepsByStatus(step.subSteps, status))
    }
  }
  return result
}

export function cloneStep(step: LLMStep): LLMStep {
  return {
    ...step,
    subSteps: step.subSteps ? step.subSteps.map(cloneStep) : undefined,
    realDataExample: step.realDataExample ? { ...step.realDataExample } : undefined,
    visualization: step.visualization ? { ...step.visualization } : undefined
  }
}

export function cloneLifecycle(lifecycle: LLMLifecycle): LLMLifecycle {
  return {
    ...lifecycle,
    steps: lifecycle.steps.map(cloneStep),
    generatedExamples: lifecycle.generatedExamples 
      ? new Map(lifecycle.generatedExamples) 
      : undefined
  }
}

export function mergeVisualizationConfigs(
  base: VisualizationConfig,
  override: Partial<VisualizationConfig>
): VisualizationConfig {
  return {
    ...base,
    ...override,
    d3Config: {
      ...base.d3Config,
      ...override.d3Config
    }
  }
}

export function calculateTotalDuration(steps: LLMStep[]): number {
  return steps.reduce((total, step) => {
    const stepDuration = step.duration || 0
    const subStepsDuration = step.subSteps ? calculateTotalDuration(step.subSteps) : 0
    return total + stepDuration + subStepsDuration
  }, 0)
}

export function getNextStepId(currentStepId: string, steps: LLMStep[]): string | null {
  const allSteps = flattenSteps(steps)
  const currentIndex = allSteps.findIndex(step => step.id === currentStepId)
  
  if (currentIndex === -1 || currentIndex >= allSteps.length - 1) {
    return null
  }

  return allSteps[currentIndex + 1].id
}

export function getPreviousStepId(currentStepId: string, steps: LLMStep[]): string | null {
  const allSteps = flattenSteps(steps)
  const currentIndex = allSteps.findIndex(step => step.id === currentStepId)
  
  if (currentIndex <= 0) {
    return null
  }

  return allSteps[currentIndex - 1].id
}

export function flattenSteps(steps: LLMStep[]): LLMStep[] {
  const flattened: LLMStep[] = []
  for (const step of steps) {
    flattened.push(step)
    if (step.subSteps) {
      flattened.push(...flattenSteps(step.subSteps))
    }
  }
  return flattened
}

export function createStepSummary(steps: LLMStep[]): {
  totalSteps: number
  mainSteps: number
  subSteps: number
  maxDepth: number
  estimatedDuration: number
} {
  const flattened = flattenSteps(steps)
  const mainSteps = steps.length
  const subSteps = flattened.length - mainSteps
  
  const maxDepth = Math.max(
    ...flattened.map(step => getStepDepth(step.id, steps))
  )

  const estimatedDuration = calculateTotalDuration(steps)

  return {
    totalSteps: flattened.length,
    mainSteps,
    subSteps,
    maxDepth,
    estimatedDuration
  }
}

export function searchSteps(steps: LLMStep[], query: string): LLMStep[] {
  const results: LLMStep[] = []
  const queryLower = query.toLowerCase()

  for (const step of steps) {
    const titleMatch = step.title.toLowerCase().includes(queryLower)
    const descriptionMatch = step.description.toLowerCase().includes(queryLower)
    
    if (titleMatch || descriptionMatch) {
      results.push(step)
    }

    if (step.subSteps) {
      results.push(...searchSteps(step.subSteps, query))
    }
  }

  return results
}

export function exportLifecycleToJSON(lifecycle: LLMLifecycle): string {
  // Create a serializable version of the lifecycle
  const serializable = {
    ...lifecycle,
    generatedExamples: lifecycle.generatedExamples 
      ? Object.fromEntries(lifecycle.generatedExamples)
      : undefined
  }
  return JSON.stringify(serializable, null, 2)
}

export function importLifecycleFromJSON(jsonString: string): LLMLifecycle {
  const parsed = JSON.parse(jsonString)
  
  return {
    ...parsed,
    generatedExamples: parsed.generatedExamples 
      ? new Map(Object.entries(parsed.generatedExamples))
      : new Map()
  }
}