# LLM Guide Step 15: Dark/Light Mode Integration

## Overview
Implement comprehensive dark and light mode support for all visualizations, ensuring the educational experience looks beautiful and maintains readability in both themes.

## Acceptance Criteria
- [ ] Integrate with existing Chakra UI theme system
- [ ] Update all D3.js visualizations for dual theme support
- [ ] Create theme-aware color palettes for data visualization
- [ ] Implement smooth theme transitions for all components
- [ ] Ensure accessibility standards in both modes
- [ ] Add theme-specific optimizations for readability
- [ ] Test color blind accessibility in both themes

## Technical Details

### Theme Integration Architecture

#### Chakra UI Theme Extension
```typescript
interface LLMGuideThemeExtension {
  visualization: {
    light: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      attention: {
        high: string;
        medium: string;
        low: string;
      };
    };
    dark: {
      // Mirror structure with dark-optimized colors
    };
  };
}
```

#### D3.js Theme Adapter
- Utility functions to extract theme colors for D3
- Color interpolation functions for theme transitions
- Scale generators using theme-appropriate palettes
- Animation-aware color transitions

### Visualization Theme Updates

#### Color Palette Strategy
- **Light Mode**: High contrast, saturated colors for clarity
- **Dark Mode**: Muted, accessible colors to reduce eye strain
- **Data Categories**: Consistent color mapping across themes
- **Accessibility**: WCAG AAA compliance for all color combinations

#### Component-Specific Adaptations

##### Tokenization Visualizations
- Token highlighting colors optimized for each theme
- Background contrast adjustments for readability
- Border and outline colors for definition
- Selection states with theme-appropriate emphasis

##### Attention Heatmaps
- Heat map color scales for light/dark backgrounds
- Grid line colors for proper contrast
- Interactive highlight colors
- Legend and label colors for readability

##### Probability Charts
- Bar colors with proper contrast ratios
- Background grid colors for depth
- Axis and tick colors for visibility
- Interactive state colors (hover, selected)

### Transition Animations

#### Smooth Theme Switching
```typescript
interface ThemeTransition {
  duration: number; // 300ms
  easing: 'ease-out';
  properties: ['background-color', 'color', 'border-color'];
  d3Updates: boolean; // Update D3 visualizations
}
```

#### D3.js Color Transitions
- Animated color interpolation for visualization elements
- Synchronized transitions with CSS theme changes  
- Staggered updates for complex visualizations
- Maintain animation smoothness during theme switch

### Accessibility Considerations

#### Color Contrast Standards
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text and UI elements
- Enhanced contrast ratios for data visualization elements
- Color blind friendly palette selection

#### Visual Indicators Beyond Color
- Shape/pattern differentiation for color blind users
- Text labels for critical information
- Multiple visual cues for interactive elements
- Sufficient spacing and sizing for clarity

## Implementation Notes
- Use Chakra UI's useColorModeValue hook consistently
- Create centralized color management for D3 visualizations
- Test theme switching performance with complex animations
- Implement theme preference persistence
- Consider system theme detection and auto-switching

### Theme Testing Strategy
- Visual regression testing for both themes
- Color contrast validation tools
- Color blind simulation testing
- Real user testing in different lighting conditions
- Performance testing during theme transitions

### Dark Mode Optimizations
- Reduced brightness for extended viewing
- Optimized attention heatmap intensity
- Softer animation colors to reduce eye strain
- Adjusted particle effects for dark backgrounds

## Definition of Done
- Both light and dark themes look professionally polished
- All D3.js visualizations work perfectly in both themes
- Theme transitions are smooth and performant
- Accessibility standards are exceeded in both modes
- Color blind users can effectively use all features
- Theme preference is properly persisted and respected