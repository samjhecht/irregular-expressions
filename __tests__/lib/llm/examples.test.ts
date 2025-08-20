import { ExampleGenerator, generateExampleForRequest } from '../../../lib/llm/examples'
import { ExampleGenerationRequest } from '../../../types/llm'

describe('ExampleGenerator', () => {
  let generator: ExampleGenerator

  beforeEach(() => {
    generator = new ExampleGenerator('Hello, how are you?')
  })

  describe('initialization', () => {
    it('should initialize with user input', () => {
      expect(generator['userInput']).toBe('Hello, how are you?')
    })

    it('should use default input when none provided', () => {
      const defaultGenerator = new ExampleGenerator()
      expect(defaultGenerator['userInput']).toBe('Hello, how are you?')
    })
  })

  describe('example generation', () => {
    const testStepIds = [
      'prompt-reception',
      'safety-filtering',
      'preprocessing',
      'byte-pair-encoding',
      'vocabulary-lookup',
      'special-tokens',
      'embedding-lookup',
      'attention-computation',
      'feed-forward',
      'layer-normalization',
      'logits-calculation',
      'sampling-strategy',
      'token-to-text',
      'response-formatting',
      'output-safety',
      'final-validation'
    ]

    testStepIds.forEach(stepId => {
      it(`should generate example for ${stepId}`, () => {
        const result = generator.generateExampleForStep(stepId)
        
        expect(result.success).toBe(true)
        expect(result.example).toBeDefined()
        expect(result.error).toBeUndefined()

        const example = result.example!
        expect(example.inputData).toBeDefined()
        expect(example.outputData).toBeDefined()
        expect(example.explanation).toBeTruthy()
        expect(example.dataType).toMatch(/^(tokens|embeddings|attention|probabilities|text)$/)
      })
    })

    it('should return error for invalid step ID', () => {
      const result = generator.generateExampleForStep('invalid-step')
      
      expect(result.success).toBe(false)
      expect(result.example).toBeUndefined()
      expect(result.error).toContain('No example generator found')
    })
  })

  describe('specific example types', () => {
    it('should generate prompt reception example with correct structure', () => {
      const result = generator.generateExampleForStep('prompt-reception')
      const example = result.example!

      expect(example.dataType).toBe('text')
      expect(example.inputData).toHaveProperty('rawInput')
      expect(example.outputData).toHaveProperty('validatedPrompt')
      expect(example.explanation).toContain('validation')
    })

    it('should generate tokenization example with tokens', () => {
      const result = generator.generateExampleForStep('byte-pair-encoding')
      const example = result.example!

      expect(example.dataType).toBe('tokens')
      expect(example.inputData).toHaveProperty('text')
      expect(example.outputData).toHaveProperty('subwords')
      expect(Array.isArray(example.outputData.subwords)).toBe(true)
    })

    it('should generate embedding example with vectors', () => {
      const result = generator.generateExampleForStep('embedding-lookup')
      const example = result.example!

      expect(example.dataType).toBe('embeddings')
      expect(example.inputData).toHaveProperty('tokenIds')
      expect(example.outputData).toHaveProperty('embeddings')
      expect(Array.isArray(example.outputData.embeddings)).toBe(true)
    })

    it('should generate attention example with matrix', () => {
      const result = generator.generateExampleForStep('attention-computation')
      const example = result.example!

      expect(example.dataType).toBe('attention')
      expect(example.inputData).toHaveProperty('queries')
      expect(example.outputData).toHaveProperty('attentionWeights')
      expect(Array.isArray(example.outputData.attentionWeights)).toBe(true)
    })

    it('should generate probability example with valid probabilities', () => {
      const result = generator.generateExampleForStep('logits-calculation')
      const example = result.example!

      expect(example.dataType).toBe('probabilities')
      expect(example.outputData).toHaveProperty('probabilities')
      expect(Array.isArray(example.outputData.probabilities)).toBe(true)
      
      // Check probabilities sum to approximately 1
      const probs = example.outputData.probabilities as number[]
      const sum = probs.reduce((acc, prob) => acc + prob, 0)
      expect(sum).toBeCloseTo(1, 2)
    })
  })

  describe('user input updates', () => {
    it('should update user input and affect generated examples', () => {
      const originalResult = generator.generateExampleForStep('prompt-reception')
      const originalInput = originalResult.example!.inputData.rawInput

      generator.updateUserInput('New test input')
      const updatedResult = generator.generateExampleForStep('prompt-reception')
      const updatedInput = updatedResult.example!.inputData.rawInput

      expect(originalInput).toBe('Hello, how are you?')
      expect(updatedInput).toBe('New test input')
    })
  })

  describe('mathematical operations', () => {
    it('should generate valid softmax probabilities', () => {
      const result = generator.generateExampleForStep('logits-calculation')
      const probabilities = result.example!.outputData.probabilities as number[]

      // All probabilities should be positive
      probabilities.forEach(prob => {
        expect(prob).toBeGreaterThanOrEqual(0)
        expect(prob).toBeLessThanOrEqual(1)
      })

      // Sum should be approximately 1
      const sum = probabilities.reduce((acc, prob) => acc + prob, 0)
      expect(sum).toBeCloseTo(1, 3)
    })

    it('should generate reasonable token distributions', () => {
      const result = generator.generateExampleForStep('byte-pair-encoding')
      const subwords = result.example!.outputData.subwords as string[]

      expect(subwords.length).toBeGreaterThan(0)
      subwords.forEach(subword => {
        expect(typeof subword).toBe('string')
        expect(subword.length).toBeGreaterThan(0)
      })
    })
  })
})

describe('generateExampleForRequest', () => {
  it('should generate example from request object', () => {
    const request: ExampleGenerationRequest = {
      stepId: 'byte-pair-encoding',
      userInput: 'Test prompt for tokenization'
    }

    const result = generateExampleForRequest(request)
    
    expect(result.success).toBe(true)
    expect(result.example).toBeDefined()
    expect(result.example!.inputData).toHaveProperty('text')
  })

  it('should handle invalid step ID in request', () => {
    const request: ExampleGenerationRequest = {
      stepId: 'invalid-step',
      userInput: 'Test input'
    }

    const result = generateExampleForRequest(request)
    
    expect(result.success).toBe(false)
    expect(result.error).toContain('No example generator found')
  })

  it('should use provided user input', () => {
    const customInput = 'Custom test input for generation'
    const request: ExampleGenerationRequest = {
      stepId: 'prompt-reception',
      userInput: customInput
    }

    const result = generateExampleForRequest(request)
    
    expect(result.success).toBe(true)
    expect(result.example!.inputData.rawInput).toBe(customInput)
  })
})