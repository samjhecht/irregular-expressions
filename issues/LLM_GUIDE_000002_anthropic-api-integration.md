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


## Proposed Solution

I will implement the Anthropic API integration with the following approach:

### Phase 1: Setup and Dependencies
1. Install `@anthropic-ai/sdk` package
2. Create TypeScript interfaces for request/response types
3. Set up environment variable configuration

### Phase 2: API Route Implementation
1. Create `/pages/api/llm/process-prompt.ts` following Next.js API route patterns
2. Implement POST handler with input validation
3. Configure Anthropic client with appropriate model selection
4. Add comprehensive error handling

### Phase 3: Security and Validation
1. Input sanitization and length restrictions
2. Rate limiting considerations for cost management
3. Proper error response formatting
4. Environment variable validation

### Technical Implementation Details

- Use Claude-3 Haiku for cost-effectiveness as specified
- Implement token counting for educational display
- Follow existing codebase patterns for API routes
- Add proper TypeScript typing throughout
- Include processing time measurement for metadata

### Testing Strategy
1. Test successful prompt processing
2. Test error conditions (invalid inputs, API failures)
3. Verify response structure matches interface
4. Check environment variable handling

This approach ensures a robust, secure, and cost-effective integration that follows the existing codebase patterns.
## Implementation Notes

### ✅ Completed Features

1. **Dependencies Installed**: Added `@anthropic-ai/sdk` to package.json
2. **TypeScript Interfaces**: Created `/types/llm.ts` with proper typing for requests, responses, and errors
3. **API Route**: Implemented `/pages/api/llm/process-prompt.ts` with:
   - Input validation and sanitization
   - Prompt length restrictions (4000 chars max)
   - Comprehensive error handling
   - Token usage tracking
   - Processing time measurement
   - Environment variable validation

### Security Features Implemented

- Input validation for prompt content and type
- Maximum prompt length restriction
- Proper error handling without exposing internal details
- Environment variable validation
- API key protection through environment variables

### Error Handling

The API handles multiple error scenarios:
- Missing/empty prompts
- Invalid data types
- Prompts exceeding length limits
- Missing API key configuration
- Anthropic API errors
- Network/server errors

### Testing Infrastructure

Created `test-llm-api.js` for manual testing of:
- Successful API calls
- Error scenarios (empty prompt, missing prompt, wrong method)
- Response structure validation

### Configuration

Required environment variables:
- `ANTHROPIC_API_KEY` - Anthropic API key (required)
- `ANTHROPIC_MODEL` - Model selection (optional, defaults to claude-3-haiku-20240307)

### Next Steps for Integration

The API is ready for integration with the LLM guide frontend. The API:
- Accepts POST requests to `/api/llm/process-prompt`
- Returns structured JSON with original prompt, response, and metadata
- Provides token counts and processing times for educational display
- Uses cost-effective Claude-3 Haiku model as specified