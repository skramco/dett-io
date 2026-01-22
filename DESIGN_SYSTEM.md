# Dett Design System

## Philosophy

**Quietly confident.** Calm, clear, trustworthy.

Inspired by:
- Stripe's clarity
- Linear's restraint
- Apple's simplicity
- NerdWallet's usefulness (without ads)

## Core Principles

1. **Neutral-first palette** - Soft off-white background, not pure white
2. **Single accent color** - Blue, used sparingly for links and CTAs
3. **No decorative gradients** - Color serves purpose, not decoration
4. **Generous whitespace** - Let content breathe
5. **Clear hierarchy** - Strong H1, subtle H2/H3, comfortable body text
6. **Subtle interactions** - No flashy animations or bouncing elements

## Color Palette

### Neutrals
- `--background`: #fafaf9 (soft off-white)
- `--surface`: #ffffff (cards, elevated surfaces)
- `--foreground`: #18181b (near-black text)
- `--muted`: #71717a (secondary text)
- `--border`: #e4e4e7 (subtle borders)

### Accent (used sparingly)
- `--accent`: #2563eb (blue - trustworthy, calm)
- `--accent-hover`: #1d4ed8
- `--accent-light`: #dbeafe

### Contextual (meaningful use only)
- `--success`: #16a34a
- `--success-light`: #dcfce7
- `--warning`: #ea580c
- `--warning-light`: #fed7aa

## Typography

**Font Stack**: System UI sans-serif
```
ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

**Hierarchy**:
- H1: 2.25rem (36px), font-weight 700
- H2: 1.875rem (30px), font-weight 600
- H3: 1.5rem (24px), font-weight 600
- H4: 1.25rem (20px), font-weight 600
- Body: 1rem (16px), line-height 1.7

## Components

### Button
```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
```

Variants:
- **primary**: Blue background, white text
- **secondary**: White background, border, foreground text
- **ghost**: No background, hover state only

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

Cards have:
- Subtle border
- White background
- Rounded corners
- Optional hover state

### Input
```tsx
<Input 
  label="Label"
  placeholder="Placeholder"
  helperText="Helper text"
  error="Error message"
/>
```

### Callout
```tsx
<Callout variant="info" title="Title">
  Message content
</Callout>
```

Variants: `info`, `success`, `warning`

## Layout

### Container
Centered content with max-width:
- sm: 768px
- md: 896px
- lg: 1152px (default)
- xl: 1280px

### Header
- Sticky top navigation
- Simple: Logo, Calculators, Learn
- No CTAs or sales messaging

### Footer
- Quiet and minimal
- Links organized by category
- No newsletter signup or marketing

## Calculator Page Pattern

Every calculator follows this structure:

1. **Back link** (subtle, top-left)
2. **Page title** (H1, clear and direct)
3. **One-line description** (purpose statement)
4. **Two-column layout**:
   - Left: Input section
   - Right: Results section
5. **Plain-English explanation** (below calculator)
6. **Related calculators** (internal links)

## Chart Styling

Charts must be:
- Simple and legible
- Neutral colors (blues, grays)
- Clear labels and annotations
- Accessible contrast
- No rainbow palettes
- Minimal animation

## Spacing System

Based on 0.25rem (4px) unit:
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

## Elevation

Subtle shadows only:
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.05)
- lg: 0 10px 15px rgba(0,0,0,0.05)

## Accessibility

- Strong contrast (WCAG AA minimum)
- Large tap targets (44px minimum)
- Keyboard navigable
- Focus states visible
- Readable on mobile

## What to Avoid

❌ Gradients as decoration
❌ Loud brand colors
❌ Heavy shadows
❌ Busy layouts
❌ Dark patterns
❌ Flashy animations
❌ Bouncing elements
❌ Attention hijacking
❌ Multiple accent colors
❌ Dense information

## Success Metric

If a user lands on Dett and thinks:

> "This feels calm. I trust this. I want to explore."

Then the design is correct.

## When in Doubt

**Remove things, don't add them.**
