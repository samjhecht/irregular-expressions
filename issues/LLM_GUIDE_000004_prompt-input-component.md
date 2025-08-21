# LLM Guide Step 4: Prompt Input Component

## Overview

Create the interactive prompt input component where users can enter their LLM prompt and trigger the educational flow.

## Acceptance Criteria

- [ ] Create responsive prompt input component
- [ ] Integrate with Anthropic API route
- [ ] Add loading states and error handling
- [ ] Implement input validation
- [ ] Support light and dark mode theming
- [ ] Add example prompts for user guidance
- [ ] Store prompt/response data for visualization

## Technical Details

### Component Structure

- Use Chakra UI form components for consistency
- Textarea for multi-line prompt input
- Submit button with loading state
- Error display area
- Example prompt suggestions

### Integration Requirements

- Call `/api/llm/process-prompt` endpoint
- Handle API responses and errors gracefully
- Store successful responses for step visualization
- Clear previous results when new prompt submitted

### UI/UX Features

- Placeholder text with helpful examples
- Character/token count display
- Responsive design for mobile/desktop
- Keyboard shortcuts (Ctrl+Enter to submit)
- Loading animations during processing

### Component Interface

```typescript
interface PromptInputProps {
  onPromptProcessed: (data: LLMProcessResponse) => void
  onError: (error: string) => void
  disabled?: boolean
}
```

### Validation Rules

- Minimum prompt length (10 characters)
- Maximum prompt length (1000 characters)
- Content filtering for inappropriate content
- Empty input handling

## Implementation Notes

- Follow existing component patterns in codebase
- Use Chakra UI theming system
- Implement proper form state management
- Consider accessibility requirements
- Add smooth transitions and animations

## Example Prompts

- "Explain how photosynthesis works"
- "Write a short story about a robot"
- "Compare TypeScript and JavaScript"
- "Create a simple recipe for chocolate cake"

## Definition of Done

- Component renders with proper styling
- Successfully submits prompts to API
- Handles all error scenarios gracefully
- Responsive design works on all screen sizes
- Loading states provide good user feedback
- Component integrates with parent page properly

## Proposed Solution

Based on analysis of the existing codebase, I will implement the PromptInput component following these steps:

1. **Component Architecture**: Create a PromptInput component using Chakra UI components, following the pattern established in SubscribeBox.tsx with Formik for form management

2. **Form Structure**:
   - Use Chakra UI FormControl, Textarea, and Button components
   - Implement proper validation using Formik's validation pattern
   - Add character counter display using the API's MAX_PROMPT_LENGTH config

3. **API Integration**:
   - Call the existing `/api/llm/process-prompt` endpoint
   - Handle LLMProcessResponse and LLMErrorResponse types correctly
   - Implement proper error handling and loading states

4. **UI Features**:
   - Example prompts dropdown/suggestions
   - Keyboard shortcuts (Ctrl+Enter to submit)
   - Loading animation during processing
   - Character count display
   - Responsive design using Chakra UI breakpoints

5. **Validation Rules**:
   - Use the existing API validation (empty check, max length)
   - Add minimum length validation (10 characters as specified)
   - Implement proper form state management

6. **Theming**: Follow the existing dark/light mode pattern and use the project's custom theme colors and fonts

The component will be created in `/components/PromptInput.tsx` and will integrate seamlessly with the existing codebase patterns and styling system.
