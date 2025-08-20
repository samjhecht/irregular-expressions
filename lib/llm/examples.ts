import {
  RealDataExample,
  ExampleGenerationRequest,
  ExampleGenerationResult
} from '../../types/llm'

export class ExampleGenerator {
  private userInput: string

  constructor(userInput = 'Hello, how are you?') {
    this.userInput = userInput
  }

  generateExampleForStep(stepId: string): ExampleGenerationResult {
    try {
      const example = this.createExampleByStepId(stepId)
      return {
        success: true,
        example
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error generating example'
      }
    }
  }

  private createExampleByStepId(stepId: string): RealDataExample {
    switch (stepId) {
      case 'prompt-reception':
        return this.createPromptReceptionExample()
      case 'safety-filtering':
        return this.createSafetyFilteringExample()
      case 'preprocessing':
        return this.createPreprocessingExample()
      case 'byte-pair-encoding':
        return this.createBPEExample()
      case 'vocabulary-lookup':
        return this.createVocabularyLookupExample()
      case 'special-tokens':
        return this.createSpecialTokensExample()
      case 'embedding-lookup':
        return this.createEmbeddingLookupExample()
      case 'attention-computation':
        return this.createAttentionComputationExample()
      case 'feed-forward':
        return this.createFeedForwardExample()
      case 'layer-normalization':
        return this.createLayerNormalizationExample()
      case 'logits-calculation':
        return this.createLogitsCalculationExample()
      case 'sampling-strategy':
        return this.createSamplingStrategyExample()
      case 'token-to-text':
        return this.createTokenToTextExample()
      case 'response-formatting':
        return this.createResponseFormattingExample()
      case 'output-safety':
        return this.createOutputSafetyExample()
      case 'final-validation':
        return this.createFinalValidationExample()
      default:
        throw new Error(`No example generator found for step: ${stepId}`)
    }
  }

  private createPromptReceptionExample(): RealDataExample {
    return {
      inputData: {
        rawInput: this.userInput,
        timestamp: new Date().toISOString(),
        contentLength: this.userInput.length,
        encoding: 'UTF-8'
      },
      outputData: {
        validatedPrompt: this.userInput,
        isValid: true,
        metadata: {
          lengthCheck: 'passed',
          encodingCheck: 'passed',
          formatCheck: 'passed'
        }
      },
      explanation: 'The system receives the raw user input and performs basic validation checks including length, encoding, and format verification.',
      dataType: 'text'
    }
  }

  private createSafetyFilteringExample(): RealDataExample {
    return {
      inputData: {
        prompt: this.userInput,
        safetyPolicies: ['harmful_content', 'personal_info', 'inappropriate_requests']
      },
      outputData: {
        safetyScore: 0.95,
        flaggedCategories: [],
        approved: true,
        confidence: 0.98
      },
      explanation: 'Safety filtering evaluates the prompt against various safety policies to ensure compliance with platform guidelines.',
      dataType: 'probabilities'
    }
  }

  private createPreprocessingExample(): RealDataExample {
    const normalized = this.userInput.trim().replace(/\s+/g, ' ')
    return {
      inputData: {
        originalText: this.userInput,
        preprocessing: ['trim_whitespace', 'normalize_spaces', 'unicode_normalization']
      },
      outputData: {
        normalizedText: normalized,
        changesApplied: this.userInput !== normalized ? ['whitespace_normalization'] : [],
        characterCount: normalized.length
      },
      explanation: 'Text preprocessing normalizes the input by removing extra whitespace and standardizing character encoding.',
      dataType: 'text'
    }
  }

  private createBPEExample(): RealDataExample {
    // Simplified BPE simulation
    const words = this.userInput.toLowerCase().split(/\s+/)
    const subwords = words.flatMap(word => {
      if (word.length <= 3) return [word]
      return [word.slice(0, -2), word.slice(-2)]
    })

    return {
      inputData: {
        text: this.userInput,
        words: words
      },
      outputData: {
        subwords: subwords,
        mergedPairs: ['th', 'er', 'in', 'on'],
        tokenCount: subwords.length
      },
      explanation: 'Byte Pair Encoding breaks words into subword units based on frequency, allowing the model to handle unseen words.',
      dataType: 'tokens'
    }
  }

  private createVocabularyLookupExample(): RealDataExample {
    const tokens = this.userInput.toLowerCase().split(/[\s,!?.]/).filter(t => t.length > 0)
    const tokenIds = tokens.map((token, index) => ({
      token,
      id: 1000 + index,
      frequency: Math.floor(Math.random() * 10000) + 1000
    }))

    return {
      inputData: {
        subwords: tokens,
        vocabularySize: 50000
      },
      outputData: {
        tokenIds: tokenIds,
        unkTokens: [],
        specialTokens: [{ token: '<BOS>', id: 1 }, { token: '<EOS>', id: 2 }]
      },
      explanation: 'Each subword is mapped to a unique integer ID from the model\'s vocabulary, creating a sequence of token IDs.',
      dataType: 'tokens'
    }
  }

  private createSpecialTokensExample(): RealDataExample {
    const baseTokens = [1, 1045, 2123, 4567, 2] // Simulated token IDs
    return {
      inputData: {
        contentTokens: baseTokens.slice(1, -1),
        sequenceType: 'user_message'
      },
      outputData: {
        finalSequence: baseTokens,
        addedTokens: [
          { position: 0, token: '<BOS>', id: 1, purpose: 'beginning_of_sequence' },
          { position: baseTokens.length - 1, token: '<EOS>', id: 2, purpose: 'end_of_sequence' }
        ]
      },
      explanation: 'Special tokens are added to mark the beginning and end of sequences, helping the model understand structure.',
      dataType: 'tokens'
    }
  }

  private createEmbeddingLookupExample(): RealDataExample {
    const tokenIds = [1, 1045, 2123, 4567, 2]
    const embeddings = tokenIds.map(() => 
      Array.from({ length: 8 }, () => Math.round((Math.random() - 0.5) * 2 * 100) / 100)
    )

    return {
      inputData: {
        tokenIds: tokenIds,
        embeddingDimension: 8,
        vocabularySize: 50000
      },
      outputData: {
        embeddings: embeddings,
        embeddingMatrix: 'lookup_table',
        dimensions: [tokenIds.length, 8]
      },
      explanation: 'Each token ID is converted to a dense vector representation that captures semantic meaning in high-dimensional space.',
      dataType: 'embeddings'
    }
  }

  private createAttentionComputationExample(): RealDataExample {
    const seqLength = 5
    const attentionMatrix = Array.from({ length: seqLength }, () =>
      Array.from({ length: seqLength }, () => Math.round(Math.random() * 100) / 100)
    )

    return {
      inputData: {
        queries: Array.from({ length: seqLength }, () => 'Q_vector'),
        keys: Array.from({ length: seqLength }, () => 'K_vector'),
        values: Array.from({ length: seqLength }, () => 'V_vector'),
        sequenceLength: seqLength
      },
      outputData: {
        attentionWeights: attentionMatrix,
        attendedValues: Array.from({ length: seqLength }, () => 'attended_vector'),
        maxAttention: 0.95,
        avgAttention: 0.20
      },
      explanation: 'Attention mechanism computes how much each token should focus on every other token in the sequence.',
      dataType: 'attention'
    }
  }

  private createFeedForwardExample(): RealDataExample {
    const inputDim = 8
    const hiddenDim = 32
    const inputVector = Array.from({ length: inputDim }, () => Math.round(Math.random() * 100) / 100)
    const outputVector = Array.from({ length: inputDim }, () => Math.round(Math.random() * 100) / 100)

    return {
      inputData: {
        inputVector: inputVector,
        inputDimension: inputDim,
        hiddenDimension: hiddenDim
      },
      outputData: {
        outputVector: outputVector,
        activation: 'ReLU',
        layersApplied: ['linear_1', 'activation', 'linear_2'],
        nonZeroNeurons: Math.floor(hiddenDim * 0.7)
      },
      explanation: 'Feed-forward networks process each position independently through multi-layer perceptrons with non-linear activations.',
      dataType: 'embeddings'
    }
  }

  private createLayerNormalizationExample(): RealDataExample {
    const vector = Array.from({ length: 8 }, () => Math.round(Math.random() * 100) / 100)
    const normalizedVector = vector.map(x => Math.round((x - 0.5) / 0.3 * 100) / 100)

    return {
      inputData: {
        unnormalizedVector: vector,
        mean: 0.5,
        variance: 0.09
      },
      outputData: {
        normalizedVector: normalizedVector,
        gamma: 1.0,
        beta: 0.0,
        epsilon: 1e-5
      },
      explanation: 'Layer normalization stabilizes training by normalizing inputs to have zero mean and unit variance.',
      dataType: 'embeddings'
    }
  }

  private createLogitsCalculationExample(): RealDataExample {
    const vocabularySize = 10
    const logits = Array.from({ length: vocabularySize }, () => 
      Math.round((Math.random() - 0.5) * 20 * 100) / 100
    )
    const probabilities = this.softmax(logits)

    return {
      inputData: {
        finalHiddenState: Array.from({ length: 8 }, () => Math.round(Math.random() * 100) / 100),
        vocabularySize: vocabularySize,
        outputProjection: 'linear_layer'
      },
      outputData: {
        logits: logits,
        probabilities: probabilities,
        topTokens: this.getTopTokens(probabilities, 3),
        temperature: 1.0
      },
      explanation: 'The final hidden state is projected to vocabulary size, producing probability scores for each possible next token.',
      dataType: 'probabilities'
    }
  }

  private createSamplingStrategyExample(): RealDataExample {
    const topTokens = [
      { token: 'I', probability: 0.4, id: 100 },
      { token: 'Hello', probability: 0.3, id: 101 },
      { token: 'How', probability: 0.2, id: 102 },
      { token: 'The', probability: 0.1, id: 103 }
    ]

    return {
      inputData: {
        probabilities: topTokens.map(t => t.probability),
        samplingMethod: 'top_p',
        temperature: 0.7,
        topP: 0.9
      },
      outputData: {
        selectedToken: topTokens[1],
        samplingPool: topTokens.slice(0, 3),
        randomSeed: 42,
        samplingReason: 'cumulative_probability_threshold'
      },
      explanation: 'Sampling strategies select the next token from the probability distribution, balancing randomness and quality.',
      dataType: 'tokens'
    }
  }

  private createTokenToTextExample(): RealDataExample {
    const selectedTokens = [
      { id: 100, token: 'I' },
      { id: 345, token: "'m" },
      { id: 2156, token: ' doing' },
      { id: 1690, token: ' well' }
    ]

    return {
      inputData: {
        selectedTokenIds: selectedTokens.map(t => t.id),
        vocabulary: 'model_vocabulary',
        decodingMethod: 'greedy'
      },
      outputData: {
        tokens: selectedTokens,
        reconstructedText: "I'm doing well",
        postprocessing: ['detokenization', 'space_normalization'],
        characterCount: 14
      },
      explanation: 'Selected token IDs are converted back to text by looking up their string representations and joining them.',
      dataType: 'text'
    }
  }

  private createResponseFormattingExample(): RealDataExample {
    const rawResponse = "I'm doing well, thank you for asking!"
    return {
      inputData: {
        rawText: rawResponse,
        formatRules: ['capitalize_first', 'add_punctuation', 'trim_whitespace']
      },
      outputData: {
        formattedText: rawResponse,
        formatting: {
          capitalization: 'applied',
          punctuation: 'verified',
          whitespace: 'trimmed'
        },
        finalLength: rawResponse.length
      },
      explanation: 'The generated text is formatted according to style guidelines and presentation requirements.',
      dataType: 'text'
    }
  }

  private createOutputSafetyExample(): RealDataExample {
    const response = "I'm doing well, thank you for asking!"
    return {
      inputData: {
        generatedText: response,
        safetyChecks: ['toxicity', 'harmful_content', 'bias_detection']
      },
      outputData: {
        safetyScore: 0.98,
        flaggedIssues: [],
        approved: true,
        confidenceLevel: 0.95,
        filteringApplied: false
      },
      explanation: 'Final safety filtering ensures the generated response meets platform safety and quality standards.',
      dataType: 'probabilities'
    }
  }

  private createFinalValidationExample(): RealDataExample {
    const response = "I'm doing well, thank you for asking!"
    return {
      inputData: {
        response: response,
        validationCriteria: ['completeness', 'relevance', 'coherence', 'length']
      },
      outputData: {
        isComplete: true,
        isRelevant: true,
        isCoherent: true,
        lengthAppropriate: true,
        qualityScore: 0.92,
        approved: true
      },
      explanation: 'Final validation ensures the response is complete, relevant, and meets quality standards before delivery.',
      dataType: 'probabilities'
    }
  }

  private softmax(logits: number[]): number[] {
    const maxLogit = Math.max(...logits)
    const expLogits = logits.map(x => Math.exp(x - maxLogit))
    const sumExp = expLogits.reduce((sum, x) => sum + x, 0)
    return expLogits.map(x => Math.round((x / sumExp) * 10000) / 10000)
  }

  private getTopTokens(probabilities: number[], topK: number): Array<{ index: number; probability: number }> {
    return probabilities
      .map((prob, index) => ({ index, probability: prob }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, topK)
  }

  updateUserInput(newInput: string): void {
    this.userInput = newInput
  }
}

export function generateExampleForRequest(request: ExampleGenerationRequest): ExampleGenerationResult {
  const generator = new ExampleGenerator(request.userInput)
  return generator.generateExampleForStep(request.stepId)
}