# Visual Rules

This document defines the ring layout, rendering medium, and drawing rules for Tree Rings.

## Rendering Medium

Use SVG for the MVP.

The ring area should be an SVG-based scene, not a Canvas scene.
This makes the concentric circles, dotted base rings, and accent arcs inspectable and easy to style.

## Ring Layout

The ring center should be placed slightly below the vertical center of the screen.

All rings must be concentric.

The initial visual state must show only dotted circular rings.

The top control bar and timer must remain visually separate from the ring center.

## Dotted Line Rule

The base rings must be made of dotted lines, not dashed lines.

Every dot on the screen must use the same visual size.
Dots should be placed at equal angular intervals on each ring.

## Arc Drawing Rule

Accent arcs begin at the 12 o'clock position and move clockwise.

The innermost ring is drawn first.
When the current ring completes one full cycle, the next outer ring begins.

Accent arcs should look like connected curved line segments, not just recolored dots.

## Static Layout Boundary

Step 1 must reserve a ring area but must not draw actual rings, dots, or arcs.

In Step 1, use an empty visual stage or placeholder container only.
Add the SVG ring elements in Step 3.
