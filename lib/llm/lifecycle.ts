import {
  LLMStep,
  LLMLifecycle,
  StepNavigationResult,
  RealDataExample
} from '../../types/llm'

export class LLMLifecycleManager {
  private lifecycle: LLMLifecycle

  constructor(steps: LLMStep[], userInput?: string) {
    this.lifecycle = {
      steps,
      currentStepId: steps.length > 0 ? steps[0].id : undefined,
      userInput,
      generatedExamples: new Map(),
      totalSteps: this.calculateTotalSteps(steps),
      completedSteps: 0
    }
  }

  private calculateTotalSteps(steps: LLMStep[]): number {
    return steps.reduce((total, step) => {
      return total + 1 + (step.subSteps ? this.calculateTotalSteps(step.subSteps) : 0)
    }, 0)
  }

  getCurrentStep(): LLMStep | undefined {
    if (!this.lifecycle.currentStepId) return undefined
    return this.findStepById(this.lifecycle.currentStepId, this.lifecycle.steps)
  }

  private findStepById(id: string, steps: LLMStep[]): LLMStep | undefined {
    for (const step of steps) {
      if (step.id === id) return step
      if (step.subSteps) {
        const found = this.findStepById(id, step.subSteps)
        if (found) return found
      }
    }
    return undefined
  }

  navigateToStep(stepId: string): StepNavigationResult {
    const step = this.findStepById(stepId, this.lifecycle.steps)
    if (!step) {
      return {
        success: false,
        error: `Step with id '${stepId}' not found`
      }
    }

    this.lifecycle.currentStepId = stepId
    return {
      success: true,
      step
    }
  }

  navigateToNext(): StepNavigationResult {
    const allSteps = this.flattenSteps(this.lifecycle.steps)
    const currentIndex = allSteps.findIndex(step => step.id === this.lifecycle.currentStepId)
    
    if (currentIndex === -1) {
      return {
        success: false,
        error: 'Current step not found'
      }
    }

    if (currentIndex >= allSteps.length - 1) {
      return {
        success: false,
        error: 'Already at the last step'
      }
    }

    const nextStep = allSteps[currentIndex + 1]
    this.lifecycle.currentStepId = nextStep.id
    
    return {
      success: true,
      step: nextStep
    }
  }

  navigateToPrevious(): StepNavigationResult {
    const allSteps = this.flattenSteps(this.lifecycle.steps)
    const currentIndex = allSteps.findIndex(step => step.id === this.lifecycle.currentStepId)
    
    if (currentIndex === -1) {
      return {
        success: false,
        error: 'Current step not found'
      }
    }

    if (currentIndex <= 0) {
      return {
        success: false,
        error: 'Already at the first step'
      }
    }

    const previousStep = allSteps[currentIndex - 1]
    this.lifecycle.currentStepId = previousStep.id
    
    return {
      success: true,
      step: previousStep
    }
  }

  private flattenSteps(steps: LLMStep[]): LLMStep[] {
    const flattened: LLMStep[] = []
    for (const step of steps) {
      flattened.push(step)
      if (step.subSteps) {
        flattened.push(...this.flattenSteps(step.subSteps))
      }
    }
    return flattened
  }

  markStepCompleted(stepId: string): boolean {
    const step = this.findStepById(stepId, this.lifecycle.steps)
    if (!step) return false

    if (step.status !== 'completed') {
      step.status = 'completed'
      this.lifecycle.completedSteps++
    }
    return true
  }

  markStepActive(stepId: string): boolean {
    // Reset all steps to pending first
    this.resetStepStatuses(this.lifecycle.steps)
    
    const step = this.findStepById(stepId, this.lifecycle.steps)
    if (!step) return false

    step.status = 'active'
    return true
  }

  private resetStepStatuses(steps: LLMStep[], excludeCompleted = true): void {
    steps.forEach(step => {
      if (!excludeCompleted || step.status !== 'completed') {
        step.status = 'pending'
      }
      if (step.subSteps) {
        this.resetStepStatuses(step.subSteps, excludeCompleted)
      }
    })
  }

  getProgress(): { completed: number; total: number; percentage: number } {
    return {
      completed: this.lifecycle.completedSteps,
      total: this.lifecycle.totalSteps,
      percentage: this.lifecycle.totalSteps > 0 
        ? Math.round((this.lifecycle.completedSteps / this.lifecycle.totalSteps) * 100)
        : 0
    }
  }

  getLifecycle(): LLMLifecycle {
    return this.lifecycle
  }

  updateUserInput(input: string): void {
    this.lifecycle.userInput = input
  }

  addGeneratedExample(stepId: string, example: RealDataExample): void {
    this.lifecycle.generatedExamples?.set(stepId, example)
  }

  getGeneratedExample(stepId: string): RealDataExample | undefined {
    return this.lifecycle.generatedExamples?.get(stepId)
  }

  getStepsByDepth(depth: number): LLMStep[] {
    const getStepsAtDepth = (steps: LLMStep[], currentDepth: number): LLMStep[] => {
      if (currentDepth === depth) return steps
      
      const result: LLMStep[] = []
      steps.forEach(step => {
        if (step.subSteps) {
          result.push(...getStepsAtDepth(step.subSteps, currentDepth + 1))
        }
      })
      return result
    }

    return getStepsAtDepth(this.lifecycle.steps, 0)
  }

  expandStep(stepId: string): boolean {
    const step = this.findStepById(stepId, this.lifecycle.steps)
    if (!step || !step.expandable) return false

    step.expandable = true
    return true
  }

  collapseStep(stepId: string): boolean {
    const step = this.findStepById(stepId, this.lifecycle.steps)
    if (!step) return false

    step.expandable = false
    return true
  }
}

export function createDefaultLifecycle(userInput?: string): LLMLifecycleManager {
  const steps = getDefaultLLMSteps()
  return new LLMLifecycleManager(steps, userInput)
}

export function getDefaultLLMSteps(): LLMStep[] {
  return [
    {
      id: 'input-processing',
      title: 'Input Processing',
      description: 'Initial processing of the user prompt including validation and preparation',
      order: 1,
      expandable: true,
      duration: 500,
      subSteps: [
        {
          id: 'prompt-reception',
          title: 'Prompt Reception',
          description: 'Receiving and validating the input prompt',
          order: 1,
          expandable: false,
          duration: 100,
          visualization: {
            type: 'flow',
            interactive: true
          }
        },
        {
          id: 'safety-filtering',
          title: 'Safety Filtering',
          description: 'Checking prompt for safety and policy compliance',
          order: 2,
          expandable: false,
          duration: 200,
          visualization: {
            type: 'flow',
            interactive: true
          }
        },
        {
          id: 'preprocessing',
          title: 'Text Preprocessing',
          description: 'Normalizing and preparing text for tokenization',
          order: 3,
          expandable: false,
          duration: 200,
          visualization: {
            type: 'sequence',
            interactive: true
          }
        }
      ],
      visualization: {
        type: 'flow',
        interactive: true
      }
    },
    {
      id: 'tokenization',
      title: 'Tokenization',
      description: 'Converting text into tokens that the model can understand',
      order: 2,
      expandable: true,
      duration: 800,
      subSteps: [
        {
          id: 'byte-pair-encoding',
          title: 'Byte Pair Encoding',
          description: 'Breaking text into subword units using BPE algorithm',
          order: 1,
          expandable: false,
          duration: 300,
          visualization: {
            type: 'sequence',
            interactive: true
          }
        },
        {
          id: 'vocabulary-lookup',
          title: 'Vocabulary Lookup',
          description: 'Converting subwords to token IDs using model vocabulary',
          order: 2,
          expandable: false,
          duration: 200,
          visualization: {
            type: 'matrix',
            interactive: true
          }
        },
        {
          id: 'special-tokens',
          title: 'Special Token Handling',
          description: 'Adding special tokens for sequence structure',
          order: 3,
          expandable: false,
          duration: 300,
          visualization: {
            type: 'sequence',
            interactive: true
          }
        }
      ],
      visualization: {
        type: 'sequence',
        interactive: true
      }
    },
    {
      id: 'model-processing',
      title: 'Model Processing',
      description: 'Processing tokens through the transformer neural network',
      order: 3,
      expandable: true,
      duration: 2000,
      subSteps: [
        {
          id: 'embedding-lookup',
          title: 'Embedding Lookup',
          description: 'Converting token IDs to high-dimensional vectors',
          order: 1,
          expandable: false,
          duration: 300,
          visualization: {
            type: 'matrix',
            interactive: true
          }
        },
        {
          id: 'attention-computation',
          title: 'Attention Computation',
          description: 'Computing attention weights between tokens',
          order: 2,
          expandable: false,
          duration: 800,
          visualization: {
            type: 'matrix',
            interactive: true
          }
        },
        {
          id: 'feed-forward',
          title: 'Feed Forward Networks',
          description: 'Processing through feed-forward neural networks',
          order: 3,
          expandable: false,
          duration: 600,
          visualization: {
            type: 'graph',
            interactive: true
          }
        },
        {
          id: 'layer-normalization',
          title: 'Layer Normalization',
          description: 'Normalizing outputs between transformer layers',
          order: 4,
          expandable: false,
          duration: 300,
          visualization: {
            type: 'flow',
            interactive: true
          }
        }
      ],
      visualization: {
        type: 'graph',
        interactive: true
      }
    },
    {
      id: 'response-generation',
      title: 'Response Generation',
      description: 'Generating output tokens and converting back to text',
      order: 4,
      expandable: true,
      duration: 1000,
      subSteps: [
        {
          id: 'logits-calculation',
          title: 'Logits Calculation',
          description: 'Computing probability scores for next tokens',
          order: 1,
          expandable: false,
          duration: 300,
          visualization: {
            type: 'matrix',
            interactive: true
          }
        },
        {
          id: 'sampling-strategy',
          title: 'Sampling Strategy',
          description: 'Selecting next tokens using sampling algorithms',
          order: 2,
          expandable: false,
          duration: 400,
          visualization: {
            type: 'graph',
            interactive: true
          }
        },
        {
          id: 'token-to-text',
          title: 'Token to Text Conversion',
          description: 'Converting selected tokens back to readable text',
          order: 3,
          expandable: false,
          duration: 300,
          visualization: {
            type: 'sequence',
            interactive: true
          }
        }
      ],
      visualization: {
        type: 'flow',
        interactive: true
      }
    },
    {
      id: 'output-processing',
      title: 'Output Processing',
      description: 'Final processing and validation of the generated response',
      order: 5,
      expandable: true,
      duration: 400,
      subSteps: [
        {
          id: 'response-formatting',
          title: 'Response Formatting',
          description: 'Formatting the response for presentation',
          order: 1,
          expandable: false,
          duration: 100,
          visualization: {
            type: 'flow',
            interactive: true
          }
        },
        {
          id: 'output-safety',
          title: 'Output Safety Filtering',
          description: 'Final safety check on generated content',
          order: 2,
          expandable: false,
          duration: 200,
          visualization: {
            type: 'flow',
            interactive: true
          }
        },
        {
          id: 'final-validation',
          title: 'Final Validation',
          description: 'Ensuring response quality and completeness',
          order: 3,
          expandable: false,
          duration: 100,
          visualization: {
            type: 'flow',
            interactive: true
          }
        }
      ],
      visualization: {
        type: 'flow',
        interactive: true
      }
    }
  ]
}