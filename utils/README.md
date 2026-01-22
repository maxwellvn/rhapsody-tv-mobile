# Responsive Utilities

This utility provides responsive sizing functions for the Rhapsody TV app to ensure it works across all screen sizes and platforms.

## Functions

### `wp(size)` - Width Percentage
Calculates responsive width based on screen width.
```typescript
// Instead of: width: 100
width: wp(100) // Scales based on screen width
```

### `hp(size)` - Height Percentage  
Calculates responsive height based on screen height.
```typescript
// Instead of: height: 50
height: hp(50) // Scales based on screen height
```

### `fs(size)` - Font Size
Calculates responsive font size with pixel-perfect scaling.
```typescript
// Instead of: fontSize: 16
fontSize: fs(16) // Scales font proportionally
```

## Constants

### `dimensions`
- `width` - Current screen width
- `height` - Current screen height  
- `isSmallDevice` - Width < 375px
- `isMediumDevice` - Width 375-414px
- `isLargeDevice` - Width >= 414px
- `isTablet` - Width >= 768px

### `spacing`
Pre-defined responsive spacing values:
- `xs`: 4px scaled
- `sm`: 8px scaled
- `md`: 12px scaled
- `lg`: 16px scaled
- `xl`: 20px scaled
- `xxl`: 24px scaled
- `xxxl`: 32px scaled

### `borderRadius`
Pre-defined responsive border radius values:
- `xs`, `sm`, `md`, `lg`, `xl`, `full`

## Platform Helpers

### `isIOS`, `isAndroid`, `isWeb`
Boolean flags for platform detection.

### `platformValue(ios, android, web?)`
Returns platform-specific values:
```typescript
top: platformValue(hp(48), hp(44)) // iOS gets 48, Android gets 44
```

## Usage Example

```typescript
import { wp, hp, fs, spacing, borderRadius, dimensions } from '@/utils/responsive';

const styles = StyleSheet.create({
  container: {
    width: wp(350),
    height: hp(200),
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  title: {
    fontSize: dimensions.isTablet ? fs(24) : fs(18),
  },
});
```

## Best Practices

1. **Use responsive functions for all sizes**: `wp()`, `hp()`, `fs()`
2. **Use spacing constants**: Instead of `padding: 16`, use `padding: spacing.lg`
3. **Use borderRadius constants**: Instead of `borderRadius: 12`, use `borderRadius: md`
4. **Check device size**: Use `dimensions.isTablet` for conditional styling
5. **Use platformValue**: For platform-specific adjustments
