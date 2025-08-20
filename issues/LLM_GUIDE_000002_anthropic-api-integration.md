# LLM Guide Step 2: Anthropic API Integration

## Overview
Set up Anthropic API integration to process user prompts and generate responses that will be used in the interactive guide.

## Acceptance Criteria
- [ ] Install and configure Anthropic SDK
- [ ] Create API route for LLM prompt processing
- [ ] Implement error handling and validation
- [ ] Use cost-effective model (Claude-3 Haiku or similar)
- [ ] Add environment variable configuration
- [ ] Create TypeScript interfaces for API responses

## Technical Details

### Dependencies
- Add `@anthropic-ai/sdk` to package.json
- Configure environment variables for API key

### API Route Structure
- Create `/pages/api/llm/process-prompt.ts`
- Accept POST requests with prompt text
- Return structured response with original prompt and LLM response
- Include metadata useful for educational display

### Response Interface
```typescript
interface LLMProcessResponse {
  originalPrompt: string;
  response: string;
  metadata: {
    model: string;
    tokenCount: {
      input: number;
      output: number;
    };
    processingTime: number;
  };
}
```

### Security & Cost Management
- Input validation and sanitization
- Rate limiting considerations
- Prompt length restrictions
- Model selection for cost optimization

## Implementation Notes
- Follow existing API route patterns in the codebase
- Use existing error handling patterns
- Consider caching responses for development
- Keep initial implementation simple and focused

## Environment Variables
- `ANTHROPIC_API_KEY` - API key for Anthropic service
- `ANTHROPIC_MODEL` - Model selection (default: claude-3-haiku-20240307)

## Definition of Done
- API route processes prompts successfully
- Returns structured response data
- Proper error handling for API failures
- TypeScript types defined and exported
- No security vulnerabilities introduced