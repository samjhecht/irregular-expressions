# LLM Guide Step 5: Basic Step Visualization

## Overview
Create the foundational step visualization component that displays the LLM lifecycle as an interactive, expandable diagram.

## Acceptance Criteria
- [ ] Create step visualization component
- [ ] Implement expandable/collapsible step behavior
- [ ] Show high-level LLM lifecycle steps
- [ ] Support click-to-expand functionality
- [ ] Display real data from user's prompt
- [ ] Maintain state of expanded/collapsed steps
- [ ] Follow site theming and responsive design

## Technical Details

### Core Component Structure
- Main container for step visualization
- Individual step components with expand/collapse
- Visual connectors between steps
- State management for step expansion
- Integration with LLM lifecycle data model

### Step Display Features
- Step title and description
- Visual indicators for expandable steps
- Progress flow visualization (arrows/connectors)
- Highlight active/current step
- Real data examples when expanded

### Component Hierarchy
```typescript
<StepVisualization>
  <StepContainer>
    <Step id="input-processing" expandable>
      <StepHeader />
      <StepContent />
      <SubSteps />
    </Step>
    <StepConnector />
    <Step id="tokenization" expandable>
      ...
    </Step>
  </StepContainer>
</StepVisualization>
```

### State Management
- Track which steps are expanded
- Store real data examples for each step
- Manage step navigation and progression
- Handle step selection and focus

### Visual Design
- Use Chakra UI components for consistency
- Implement smooth expand/collapse animations
- Color coding for different step types
- Icons for visual step identification
- Responsive layout for mobile/desktop

## Implementation Notes
- Start with basic layout before adding animations
- Use existing theme colors and spacing
- Ensure keyboard accessibility
- Design for future D3.js integration
- Keep initial version simple but extensible

## Step Categories
1. **Input Processing** - Green theme, input icon
2. **Tokenization** - Blue theme, tokenize icon  
3. **Model Processing** - Purple theme, brain icon
4. **Response Generation** - Orange theme, output icon
5. **Output Processing** - Gray theme, filter icon

## Definition of Done
- All 5 main steps display correctly
- Expand/collapse functionality works smoothly
- Real data from user prompt displays in steps
- Component integrates with prompt input component
- Responsive design works across devices
- Animations and transitions feel natural