@AGENTS.md

# Tree Rings

Tree Rings is a visual count-up timer inspired by tree rings.

Build this prototype inside the existing Next.js project in this folder.
Do not create a separate root `index.html`, and do not replace the project with a new non-Next.js app.

For implementation, use the existing App Router entry files such as `app/page.tsx` and `app/globals.css`.
Before editing Next.js code, read the relevant files in `node_modules/next/dist/docs/` because this installed Next.js version may differ from common assumptions.

The product does not connect total focus time into one continuous arc.
Instead, it draws only the focused segments on top of the global elapsed timeline.

If the user pauses for 10 seconds, that paused interval must remain dotted.
When the user starts again, the new accent arc begins at the current elapsed-time position.

Core rule:
- elapsedTime controls the visual position on the rings.
- activeSegments controls which parts become accent arcs.
- paused intervals remain dotted.

Default implementation choices:
- Render rings and accent arcs with SVG.
- Use a system monospace font stack unless a future design document overrides it.
- Keep Step 1 as a static layout only. Do not add timer state, event listeners, animation loops, zoom logic, or ring drawing logic in Step 1.

Read the following documents before editing code:

- docs/PROJECT_BRIEF.md
- docs/DESIGN_SYSTEM.md
- docs/TIMER_LOGIC.md
- docs/VISUAL_RULES.md
- docs/INTERACTION_RULES.md
- docs/DEPLOYMENT.md
- docs/TASK_PLAN.md
