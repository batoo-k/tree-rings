# Project Brief

Tree Rings is a visual count-up timer inspired by tree rings.

The prototype must be built in the existing Next.js project in this folder.
The primary implementation surface is the App Router app, especially `app/page.tsx` and the app-level stylesheet.
Do not create a standalone root `index.html`, and do not discard the existing Next.js structure.

The interface visualizes time as circular growth. The rings represent the global elapsed timeline, while accent arcs represent only the periods when the user was actively focusing.

The goal is to create a quiet, minimal, contemplative timer that makes time feel accumulated rather than consumed.

## MVP Shape

- A single-page web prototype.
- START, PAUSE, and RESET controls.
- A count-up timer display in `mm:ss` format, starting at `00:00`.
- Concentric tree-ring visuals.
- Active focus periods drawn as accent arcs on the global elapsed timeline.
- Paused intervals left as dotted base rings.
- Desktop-first responsive layout.

## Default Technical Decisions

- Framework: existing Next.js app in this folder.
- Language: TypeScript.
- Ring rendering: SVG.
- Font: system monospace stack.
- Deployment target: Vercel.

These decisions are part of the brief unless a later document explicitly changes them.
