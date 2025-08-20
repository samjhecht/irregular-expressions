// Demo file to showcase the LLM lifecycle functionality
// This file demonstrates the key features implemented

import { createDefaultLifecycle, ExampleGenerator } from './index'
import { AttentionComputationData } from '../../types/llm'

// Type guard function to check if data is AttentionComputationData
function isAttentionComputationData(data: unknown): data is AttentionComputationData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'attentionWeights' in data &&
    Array.isArray((data as AttentionComputationData).attentionWeights)
  )
}

export function runLLMLifecycleDemo() {
  console.log('🚀 LLM Lifecycle Data Model Demo\n')

  // Create a lifecycle manager with user input
  const userInput = 'Explain how neural networks work'
  const manager = createDefaultLifecycle(userInput)
  const lifecycle = manager.getLifecycle()

  console.log(`📝 User Input: "${userInput}"`)
  console.log(`📊 Total Steps: ${lifecycle.totalSteps} (${lifecycle.steps.length} main steps)`)
  console.log(`📍 Current Step: ${manager.getCurrentStep()?.title}\n`)

  // Demonstrate step navigation
  console.log('🔄 Step Navigation Demo:')
  manager.navigateToStep('tokenization')
  console.log(`   Current: ${manager.getCurrentStep()?.title}`)
  
  const nextResult = manager.navigateToNext()
  if (nextResult.success) {
    console.log(`   Next: ${nextResult.step?.title}`)
  }

  // Demonstrate progress tracking
  console.log('\n📈 Progress Tracking Demo:')
  const initialProgress = manager.getProgress()
  console.log(`   Initial: ${initialProgress.completed}/${initialProgress.total} (${initialProgress.percentage}%)`)
  
  manager.markStepCompleted('input-processing')
  manager.markStepCompleted('prompt-reception')
  const updatedProgress = manager.getProgress()
  console.log(`   After marking 2 complete: ${updatedProgress.completed}/${updatedProgress.total} (${updatedProgress.percentage}%)`)

  // Demonstrate example generation
  console.log('\n🔬 Example Generation Demo:')
  const exampleGenerator = new ExampleGenerator(userInput)
  
  const tokenizationExample = exampleGenerator.generateExampleForStep('byte-pair-encoding')
  if (tokenizationExample.success && tokenizationExample.example) {
    console.log(`   Tokenization example data type: ${tokenizationExample.example.dataType}`)
    console.log(`   Input tokens: ${JSON.stringify(tokenizationExample.example.inputData)}`)
  }

  const attentionExample = exampleGenerator.generateExampleForStep('attention-computation')
  if (attentionExample.success && attentionExample.example) {
    console.log(`   Attention example data type: ${attentionExample.example.dataType}`)
    
    if (isAttentionComputationData(attentionExample.example.outputData)) {
      const attentionWeights = attentionExample.example.outputData.attentionWeights
      console.log(`   Attention matrix size: ${attentionWeights.length}x${attentionWeights[0]?.length || 0}`)
    } else {
      console.log('   Attention data format not recognized')
    }
  }

  // Demonstrate step hierarchy
  console.log('\n🏗️ Step Hierarchy Demo:')
  const mainSteps = manager.getStepsByDepth(0)
  console.log(`   Main steps: ${mainSteps.length}`)
  
  mainSteps.forEach((step, index) => {
    console.log(`   ${index + 1}. ${step.title} (${step.subSteps?.length || 0} sub-steps)`)
    step.subSteps?.forEach((subStep, subIndex) => {
      console.log(`      ${index + 1}.${subIndex + 1} ${subStep.title}`)
    })
  })

  console.log('\n✅ Demo completed successfully!')
  
  return {
    lifecycle: manager.getLifecycle(),
    exampleCount: lifecycle.totalSteps,
    demonstratedFeatures: [
      'Step navigation',
      'Progress tracking',
      'Example generation',
      'Step hierarchy',
      'User input integration'
    ]
  }
}

// Export for use in other parts of the application
export function getLifecycleOverview() {
  const manager = createDefaultLifecycle()
  const steps = manager.getLifecycle().steps
  
  return {
    totalSteps: manager.getLifecycle().totalSteps,
    mainSteps: steps.map(step => ({
      id: step.id,
      title: step.title,
      description: step.description,
      subStepCount: step.subSteps?.length || 0,
      estimatedDuration: step.duration || 0
    })),
    features: {
      navigationSupport: true,
      progressTracking: true,
      realExamples: true,
      expandableSteps: true,
      visualizationConfig: true
    }
  }
}