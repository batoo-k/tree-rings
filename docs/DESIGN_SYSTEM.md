# Design System

## Visual Mood

Tree Rings should feel quiet, slow, focused, and organic.
The visual tone is inspired by tree rings, hourglass sand, dark paper, and minimal album-poster graphics.

## Color Direction

- Background: deep charcoal, dark brown, or muted midnight blue.
- Dotted rings: low-contrast gray or muted gray-brown.
- Accent arcs: warm sand, amber, muted orange, or red-brown.
- Text: soft ivory or warm gray.

## Suggested Palette

- Background: #171614
- Dotted Ring: #4A4945
- Accent Ring: #D6A15C
- Text: #F2E8D5
- Button Border: #6A655C

## Typography

Use a system monospace font stack for the prototype:

```css
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
```

Use regular or medium weights. Avoid decorative fonts and avoid loading remote fonts for the MVP.

## Step 1 Visual Requirements

The initial static layout must use all of these colors:

- `#171614` as the full-screen background.
- `#F2E8D5` for primary text, including the static timer.
- `#6A655C` for button borders or subtle control outlines.

The accent and dotted ring colors may appear later when the SVG rings are introduced.
