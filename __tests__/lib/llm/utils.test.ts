import {
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
  calculateTotalDuration,
  getNextStepId,
  getPreviousStepId,
  flattenSteps,
  createStepSummary,
  searchSteps,
  exportLifecycleToJSON,
  importLifecycleFromJSON
} from '../../../lib/llm/utils'
import { LLMStep, LLMLifecycle } from '../../../types/llm'

describe('validateStepStructure', () => {
  const validStep: LLMStep = {
    id: 'test-step',
    title: 'Test Step',
    description: 'A test step for validation',
    order: 1,
    expandable: true
  }

  it('should validate a correct step structure', () => {
    const result = validateStepStructure(validStep)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should reject step without id', () => {
    const invalidStep = { ...validStep, id: '' }
    const result = validateStepStructure(invalidStep)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Step must have a valid string id')
  })

  it('should reject step with invalid order', () => {
    const invalidStep = { ...validStep, order: -1 }
    const result = validateStepStructure(invalidStep)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Step order must be a positive number')
  })

  it('should validate step with sub-steps', () => {
    const stepWithSubSteps: LLMStep = {
      ...validStep,
      subSteps: [
        { ...validStep, id: 'sub-step-1', order: 1 },
        { ...validStep, id: 'sub-step-2', order: 2 }
      ]
    }
    const result = validateStepStructure(stepWithSubSteps)
    expect(result.isValid).toBe(true)
  })

  it('should reject step with invalid sub-steps', () => {
    const stepWithInvalidSubSteps: LLMStep = {
      ...validStep,
      subSteps: [
        { ...validStep, id: '', order: 1 } // Invalid sub-step
      ]
    }
    const result = validateStepStructure(stepWithInvalidSubSteps)
    expect(result.isValid).toBe(false)
    expect(result.errors.some(error => error.includes('SubStep'))).toBe(true)
  })
})

describe('validateLifecycleStructure', () => {
  const validLifecycle: LLMLifecycle = {
    steps: [
      {
        id: 'step-1',
        title: 'Step 1',
        description: 'First step',
        order: 1,
        expandable: true
      },
      {
        id: 'step-2',
        title: 'Step 2',
        description: 'Second step',
        order: 2,
        expandable: false
      }
    ],
    totalSteps: 2,
    completedSteps: 0
  }

  it('should validate a correct lifecycle structure', () => {
    const result = validateLifecycleStructure(validLifecycle)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should reject lifecycle without steps', () => {
    const invalidLifecycle = { ...validLifecycle, steps: [] }
    const result = validateLifecycleStructure(invalidLifecycle)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Lifecycle must have at least one step')
  })

  it('should reject lifecycle with duplicate step IDs', () => {
    const invalidLifecycle: LLMLifecycle = {
      ...validLifecycle,
      steps: [
        validLifecycle.steps[0],
        { ...validLifecycle.steps[1], id: 'step-1' } // Duplicate ID
      ]
    }
    const result = validateLifecycleStructure(invalidLifecycle)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Duplicate step IDs found in lifecycle')
  })

  it('should reject lifecycle with invalid step ordering', () => {
    const invalidLifecycle: LLMLifecycle = {
      ...validLifecycle,
      steps: [
        { ...validLifecycle.steps[0], order: 2 },
        { ...validLifecycle.steps[1], order: 1 }
      ]
    }
    const result = validateLifecycleStructure(invalidLifecycle)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Main steps are not properly ordered')
  })
})

describe('getAllStepIds', () => {
  const stepsWithSubSteps: LLMStep[] = [
    {
      id: 'main-1',
      title: 'Main 1',
      description: 'First main step',
      order: 1,
      expandable: true,
      subSteps: [
        { id: 'sub-1-1', title: 'Sub 1-1', description: 'Sub step', order: 1, expandable: false },
        { id: 'sub-1-2', title: 'Sub 1-2', description: 'Sub step', order: 2, expandable: false }
      ]
    },
    {
      id: 'main-2',
      title: 'Main 2',
      description: 'Second main step',
      order: 2,
      expandable: false
    }
  ]

  it('should collect all step IDs including sub-steps', () => {
    const ids = getAllStepIds(stepsWithSubSteps)
    expect(ids).toEqual(['main-1', 'sub-1-1', 'sub-1-2', 'main-2'])
  })

  it('should handle steps without sub-steps', () => {
    const simpleSteps = stepsWithSubSteps.filter(step => !step.subSteps)
    const ids = getAllStepIds(simpleSteps)
    expect(ids).toEqual(['main-2'])
  })
})

describe('getStepDepth', () => {
  const nestedSteps: LLMStep[] = [
    {
      id: 'level-0',
      title: 'Level 0',
      description: 'Top level',
      order: 1,
      expandable: true,
      subSteps: [
        {
          id: 'level-1',
          title: 'Level 1',
          description: 'Second level',
          order: 1,
          expandable: true,
          subSteps: [
            { id: 'level-2', title: 'Level 2', description: 'Third level', order: 1, expandable: false }
          ]
        }
      ]
    }
  ]

  it('should return correct depth for each level', () => {
    expect(getStepDepth('level-0', nestedSteps)).toBe(0)
    expect(getStepDepth('level-1', nestedSteps)).toBe(1)
    expect(getStepDepth('level-2', nestedSteps)).toBe(2)
  })

  it('should return -1 for non-existent step', () => {
    expect(getStepDepth('non-existent', nestedSteps)).toBe(-1)
  })
})

describe('getStepPath', () => {
  const nestedSteps: LLMStep[] = [
    {
      id: 'main',
      title: 'Main',
      description: 'Main step',
      order: 1,
      expandable: true,
      subSteps: [
        { id: 'sub', title: 'Sub', description: 'Sub step', order: 1, expandable: false }
      ]
    }
  ]

  it('should return path to step', () => {
    const path = getStepPath('sub', nestedSteps)
    expect(path).toEqual(['main', 'sub'])
  })

  it('should return path for top-level step', () => {
    const path = getStepPath('main', nestedSteps)
    expect(path).toEqual(['main'])
  })

  it('should return null for non-existent step', () => {
    const path = getStepPath('non-existent', nestedSteps)
    expect(path).toBeNull()
  })
})

describe('getParentStep', () => {
  const stepsWithParents: LLMStep[] = [
    {
      id: 'parent',
      title: 'Parent',
      description: 'Parent step',
      order: 1,
      expandable: true,
      subSteps: [
        { id: 'child', title: 'Child', description: 'Child step', order: 1, expandable: false }
      ]
    }
  ]

  it('should find parent of sub-step', () => {
    const parent = getParentStep('child', stepsWithParents)
    expect(parent?.id).toBe('parent')
  })

  it('should return null for top-level step', () => {
    const parent = getParentStep('parent', stepsWithParents)
    expect(parent).toBeNull()
  })

  it('should return null for non-existent step', () => {
    const parent = getParentStep('non-existent', stepsWithParents)
    expect(parent).toBeNull()
  })
})

describe('cloneStep', () => {
  const originalStep: LLMStep = {
    id: 'original',
    title: 'Original',
    description: 'Original step',
    order: 1,
    expandable: true,
    subSteps: [
      { id: 'sub', title: 'Sub', description: 'Sub step', order: 1, expandable: false }
    ],
    realDataExample: {
      inputData: { test: 'input' },
      outputData: { test: 'output' },
      explanation: 'Test',
      dataType: 'text'
    }
  }

  it('should create deep clone of step', () => {
    const cloned = cloneStep(originalStep)
    
    expect(cloned).toEqual(originalStep)
    expect(cloned).not.toBe(originalStep)
    expect(cloned.subSteps).not.toBe(originalStep.subSteps)
    expect(cloned.realDataExample).not.toBe(originalStep.realDataExample)
  })

  it('should allow independent modification of cloned step', () => {
    const cloned = cloneStep(originalStep)
    cloned.title = 'Modified'
    
    expect(originalStep.title).toBe('Original')
    expect(cloned.title).toBe('Modified')
  })
})

describe('calculateTotalDuration', () => {
  const stepsWithDuration: LLMStep[] = [
    {
      id: 'step-1',
      title: 'Step 1',
      description: 'First step',
      order: 1,
      expandable: true,
      duration: 1000,
      subSteps: [
        { id: 'sub-1', title: 'Sub 1', description: 'Sub step', order: 1, expandable: false, duration: 500 }
      ]
    },
    {
      id: 'step-2',
      title: 'Step 2',
      description: 'Second step',
      order: 2,
      expandable: false,
      duration: 800
    }
  ]

  it('should calculate total duration including sub-steps', () => {
    const total = calculateTotalDuration(stepsWithDuration)
    expect(total).toBe(2300) // 1000 + 500 + 800
  })

  it('should handle steps without duration', () => {
    const stepsWithoutDuration = stepsWithDuration.map(step => ({ 
      ...step, 
      duration: undefined,
      subSteps: step.subSteps?.map(subStep => ({ ...subStep, duration: undefined }))
    }))
    const total = calculateTotalDuration(stepsWithoutDuration)
    expect(total).toBe(0)
  })
})

describe('flattenSteps', () => {
  const nestedSteps: LLMStep[] = [
    {
      id: 'main-1',
      title: 'Main 1',
      description: 'First main',
      order: 1,
      expandable: true,
      subSteps: [
        { id: 'sub-1', title: 'Sub 1', description: 'Sub step', order: 1, expandable: false }
      ]
    },
    {
      id: 'main-2',
      title: 'Main 2',
      description: 'Second main',
      order: 2,
      expandable: false
    }
  ]

  it('should flatten nested steps', () => {
    const flattened = flattenSteps(nestedSteps)
    const ids = flattened.map(step => step.id)
    expect(ids).toEqual(['main-1', 'sub-1', 'main-2'])
  })
})

describe('createStepSummary', () => {
  const complexSteps: LLMStep[] = [
    {
      id: 'main-1',
      title: 'Main 1',
      description: 'First main',
      order: 1,
      expandable: true,
      duration: 1000,
      subSteps: [
        { id: 'sub-1', title: 'Sub 1', description: 'Sub step', order: 1, expandable: false, duration: 200 },
        { id: 'sub-2', title: 'Sub 2', description: 'Sub step', order: 2, expandable: false, duration: 300 }
      ]
    },
    {
      id: 'main-2',
      title: 'Main 2',
      description: 'Second main',
      order: 2,
      expandable: false,
      duration: 500
    }
  ]

  it('should create comprehensive summary', () => {
    const summary = createStepSummary(complexSteps)
    
    expect(summary.totalSteps).toBe(4)
    expect(summary.mainSteps).toBe(2)
    expect(summary.subSteps).toBe(2)
    expect(summary.maxDepth).toBe(1)
    expect(summary.estimatedDuration).toBe(2000)
  })
})

describe('searchSteps', () => {
  const searchableSteps: LLMStep[] = [
    {
      id: 'tokenization',
      title: 'Tokenization Process',
      description: 'Convert text to tokens using BPE algorithm',
      order: 1,
      expandable: true
    },
    {
      id: 'embedding',
      title: 'Embedding Lookup',
      description: 'Look up vector embeddings for tokens',
      order: 2,
      expandable: false
    }
  ]

  it('should find steps by title', () => {
    const results = searchSteps(searchableSteps, 'tokenization')
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('tokenization')
  })

  it('should find steps by description', () => {
    const results = searchSteps(searchableSteps, 'vector')
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('embedding')
  })

  it('should be case insensitive', () => {
    const results = searchSteps(searchableSteps, 'EMBEDDING')
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('embedding')
  })

  it('should return empty array for no matches', () => {
    const results = searchSteps(searchableSteps, 'nonexistent')
    expect(results).toHaveLength(0)
  })
})

describe('exportLifecycleToJSON and importLifecycleFromJSON', () => {
  const lifecycle: LLMLifecycle = {
    steps: [
      {
        id: 'test-step',
        title: 'Test Step',
        description: 'A test step',
        order: 1,
        expandable: true
      }
    ],
    totalSteps: 1,
    completedSteps: 0,
    generatedExamples: new Map([['test-step', {
      inputData: { test: 'input' },
      outputData: { test: 'output' },
      explanation: 'Test example',
      dataType: 'text'
    }]])
  }

  it('should export and import lifecycle correctly', () => {
    const jsonString = exportLifecycleToJSON(lifecycle)
    expect(typeof jsonString).toBe('string')
    
    const importedLifecycle = importLifecycleFromJSON(jsonString)
    expect(importedLifecycle.steps).toEqual(lifecycle.steps)
    expect(importedLifecycle.totalSteps).toBe(lifecycle.totalSteps)
    expect(importedLifecycle.generatedExamples?.get('test-step')).toEqual(
      lifecycle.generatedExamples?.get('test-step')
    )
  })

  it('should handle lifecycle without generated examples', () => {
    const simpleLifecycle = { ...lifecycle, generatedExamples: undefined }
    const jsonString = exportLifecycleToJSON(simpleLifecycle)
    const importedLifecycle = importLifecycleFromJSON(jsonString)
    
    expect(importedLifecycle.generatedExamples).toBeInstanceOf(Map)
    expect(importedLifecycle.generatedExamples?.size).toBe(0)
  })
})