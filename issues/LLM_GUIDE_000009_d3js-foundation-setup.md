# LLM Guide Step 9: D3.js Foundation Setup

## Overview
Set up D3.js infrastructure and create the foundational visualization framework for enhanced interactive diagrams and animations.

## Acceptance Criteria
- [ ] Install and configure D3.js dependencies
- [ ] Create reusable D3 component wrapper for React
- [ ] Implement basic SVG visualization foundation
- [ ] Set up responsive D3 charts with Chakra UI theming
- [ ] Create utility functions for data binding and updates
- [ ] Establish animation and transition framework
- [ ] Ensure TypeScript compatibility

## Technical Details

### Dependencies
- Add D3.js core libraries to package.json
- Consider modular imports to reduce bundle size
- Add TypeScript definitions for D3

```json
{
  "d3-selection": "^3.0.0",
  "d3-scale": "^4.0.0", 
  "d3-axis": "^3.0.0",
  "d3-transition": "^3.0.0",
  "d3-interpolate": "^3.0.0",
  "d3-force": "^3.0.0",
  "@types/d3-selection": "^3.0.0"
}
```

### React-D3 Integration Pattern
Create wrapper component for seamless React-D3 integration:

```typescript
interface D3ComponentProps {
  width: number;
  height: number;
  data: unknown;
  theme: ChakraTheme;
  onUpdate?: (selection: d3.Selection) => void;
}

const D3Visualization: React.FC<D3ComponentProps> = ({
  width,
  height,
  data,
  theme,
  onUpdate
}) => {
  // D3 + React integration pattern
}
```

### Visualization Foundation
- SVG container management
- Responsive sizing with ResizeObserver
- Theme integration (colors, fonts from Chakra UI)
- Animation timing and easing functions
- Data update patterns for smooth transitions

### Utility Functions
- Scale creation helpers
- Color palette generation from theme
- Animation timing utilities
- Event handling for interactive features
- Data transformation helpers

## Implementation Notes
- Research React + D3.js best practices (2024 patterns)
- Avoid D3's DOM manipulation conflicting with React
- Use D3 for calculations, React for rendering where possible
- Consider react-spring for some animations
- Ensure mobile touch interactions work properly

### Integration Strategy
1. **Hybrid Approach**: Use D3 for scales, math, layouts
2. **React for DOM**: Let React handle actual rendering
3. **D3 Transitions**: Use D3 for complex animations
4. **Event Handling**: React synthetic events + D3 zoom/drag

### Theme Integration
- Extract Chakra UI colors for D3 visualizations
- Use consistent typography and spacing
- Support light/dark mode switching
- Maintain accessibility standards

## Definition of Done
- D3.js properly installed and configured
- Basic wrapper component works with sample data
- Theming integration functions correctly
- TypeScript types are properly defined
- Responsive design works across screen sizes
- Foundation ready for specific LLM visualizations