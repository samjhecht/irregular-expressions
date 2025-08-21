import { LLMLifecycleManager, createDefaultLifecycle, getDefaultLLMSteps } from '../../../lib/llm/lifecycle'
import { LLMStep } from '../../../types/llm'

describe('LLMLifecycleManager', () => {
  let manager: LLMLifecycleManager
  let steps: LLMStep[]

  beforeEach(() => {
    steps = getDefaultLLMSteps()
    manager = new LLMLifecycleManager(steps, 'Test input')
  })

  describe('initialization', () => {
    it('should initialize with provided steps', () => {
      const lifecycle = manager.getLifecycle()
      expect(lifecycle.steps).toHaveLength(5)
      expect(lifecycle.userInput).toBe('Test input')
      expect(lifecycle.totalSteps).toBeGreaterThan(5) // Including sub-steps
    })

    it('should set first step as current', () => {
      const currentStep = manager.getCurrentStep()
      expect(currentStep?.id).toBe('input-processing')
    })

    it('should calculate total steps correctly', () => {
      const lifecycle = manager.getLifecycle()
      expect(lifecycle.totalSteps).toBe(21) // 5 main + 16 sub-steps
    })
  })

  describe('navigation', () => {
    it('should navigate to specific step by ID', () => {
      const result = manager.navigateToStep('tokenization')
      expect(result.success).toBe(true)
      expect(result.step?.id).toBe('tokenization')
      expect(manager.getCurrentStep()?.id).toBe('tokenization')
    })

    it('should return error for invalid step ID', () => {
      const result = manager.navigateToStep('invalid-step')
      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should navigate to next step', () => {
      const result = manager.navigateToNext()
      expect(result.success).toBe(true)
      expect(result.step?.id).toBe('prompt-reception')
    })

    it('should navigate to previous step', () => {
      manager.navigateToNext() // Move to second step
      const result = manager.navigateToPrevious()
      expect(result.success).toBe(true)
      expect(result.step?.id).toBe('input-processing')
    })

    it('should handle navigation at boundaries', () => {
      // At first step
      const prevResult = manager.navigateToPrevious()
      expect(prevResult.success).toBe(false)

      // Navigate to last step
      const allSteps = manager['flattenSteps'](steps)
      manager.navigateToStep(allSteps[allSteps.length - 1].id)
      
      const nextResult = manager.navigateToNext()
      expect(nextResult.success).toBe(false)
    })
  })

  describe('step status management', () => {
    it('should mark step as completed', () => {
      const success = manager.markStepCompleted('input-processing')
      expect(success).toBe(true)
      
      const step = manager.getCurrentStep()
      expect(step?.status).toBe('completed')
      
      const progress = manager.getProgress()
      expect(progress.completed).toBe(1)
    })

    it('should mark step as active', () => {
      const success = manager.markStepActive('tokenization')
      expect(success).toBe(true)
      
      const steps = manager.getLifecycle().steps
      const tokenizationStep = manager['findStepById']('tokenization', steps)
      expect(tokenizationStep?.status).toBe('active')
    })

    it('should not increment completed count for already completed steps', () => {
      manager.markStepCompleted('input-processing')
      const initialProgress = manager.getProgress()
      
      manager.markStepCompleted('input-processing') // Mark again
      const finalProgress = manager.getProgress()
      
      expect(finalProgress.completed).toBe(initialProgress.completed)
    })
  })

  describe('progress tracking', () => {
    it('should calculate progress correctly', () => {
      const initialProgress = manager.getProgress()
      expect(initialProgress.completed).toBe(0)
      expect(initialProgress.total).toBe(21)
      expect(initialProgress.percentage).toBe(0)

      manager.markStepCompleted('input-processing')
      const updatedProgress = manager.getProgress()
      expect(updatedProgress.completed).toBe(1)
      expect(updatedProgress.percentage).toBe(5) // 1/21 * 100 ≈ 5
    })
  })

  describe('user input management', () => {
    it('should update user input', () => {
      manager.updateUserInput('New input')
      const lifecycle = manager.getLifecycle()
      expect(lifecycle.userInput).toBe('New input')
    })
  })

  describe('example management', () => {
    it('should add and retrieve generated examples', () => {
      const example = {
        inputData: { test: 'input' },
        outputData: { test: 'output' },
        explanation: 'Test explanation',
        dataType: 'text' as const
      }

      manager.addGeneratedExample('test-step', example)
      const retrieved = manager.getGeneratedExample('test-step')
      expect(retrieved).toEqual(example)
    })

    it('should return undefined for non-existent examples', () => {
      const retrieved = manager.getGeneratedExample('non-existent')
      expect(retrieved).toBeUndefined()
    })
  })

  describe('step hierarchy', () => {
    it('should get steps by depth', () => {
      const mainSteps = manager.getStepsByDepth(0)
      expect(mainSteps).toHaveLength(5)
      
      const subSteps = manager.getStepsByDepth(1)
      expect(subSteps.length).toBeGreaterThan(0)
    })
  })

  describe('step expansion/collapse', () => {
    it('should expand expandable steps', () => {
      const success = manager.expandStep('input-processing')
      expect(success).toBe(true)
    })

    it('should collapse steps', () => {
      const success = manager.collapseStep('input-processing')
      expect(success).toBe(true)
    })

    it('should handle invalid step IDs', () => {
      const expandResult = manager.expandStep('invalid')
      expect(expandResult).toBe(false)
      
      const collapseResult = manager.collapseStep('invalid')
      expect(collapseResult).toBe(false)
    })
  })
})

describe('createDefaultLifecycle', () => {
  it('should create lifecycle with default steps', () => {
    const manager = createDefaultLifecycle('Test input')
    const lifecycle = manager.getLifecycle()
    
    expect(lifecycle.steps).toHaveLength(5)
    expect(lifecycle.userInput).toBe('Test input')
    expect(lifecycle.totalSteps).toBe(21)
  })

  it('should create lifecycle without user input', () => {
    const manager = createDefaultLifecycle()
    const lifecycle = manager.getLifecycle()
    
    expect(lifecycle.userInput).toBeUndefined()
    expect(lifecycle.steps).toHaveLength(5)
  })
})

describe('getDefaultLLMSteps', () => {
  it('should return properly structured steps', () => {
    const steps = getDefaultLLMSteps()
    
    expect(steps).toHaveLength(5)
    
    // Check main step structure
    steps.forEach((step, index) => {
      expect(step.id).toBeDefined()
      expect(step.title).toBeDefined()
      expect(step.description).toBeDefined()
      expect(step.order).toBe(index + 1)
      expect(step.expandable).toBe(true)
      expect(step.subSteps).toBeDefined()
      expect(step.subSteps?.length).toBeGreaterThan(0)
    })

    // Check sub-step structure
    steps.forEach(step => {
      step.subSteps?.forEach(subStep => {
        expect(subStep.id).toBeDefined()
        expect(subStep.title).toBeDefined()
        expect(subStep.description).toBeDefined()
        expect(subStep.order).toBeGreaterThan(0)
        expect(subStep.expandable).toBe(false)
        expect(subStep.visualization).toBeDefined()
      })
    })
  })

  it('should have unique step IDs', () => {
    const steps = getDefaultLLMSteps()
    const allIds: string[] = []
    
    const collectIds = (stepList: LLMStep[]) => {
      stepList.forEach(step => {
        allIds.push(step.id)
        if (step.subSteps) {
          collectIds(step.subSteps)
        }
      })
    }
    
    collectIds(steps)
    const uniqueIds = new Set(allIds)
    expect(uniqueIds.size).toBe(allIds.length)
  })
})