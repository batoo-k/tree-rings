# Task Plan

Build Tree Rings in small steps.
Each step should have a narrow acceptance check so later agents do not accidentally implement future behavior too early.

## Step 1 - Static Next.js Layout

Create the base layout inside the existing Next.js app.

Acceptance criteria:

- Use the existing Next.js project structure.
- Implement the first screen through `app/page.tsx` and app-level CSS.
- Do not create a root `index.html`.
- Apply the full-screen background color `#171614`.
- Add a top control area with three visible buttons: START, PAUSE, RESET.
- Add a static timer display in `00:00` format.
- Keep the buttons and timer grouped in the same control area.
- Reserve a visual stage for future rings slightly below the vertical center of the screen.
- Use `#171614`, `#F2E8D5`, and `#6A655C` in the visible layout.
- The page must render immediately through the Next.js dev server.

Step 1 must not include:

- Real timer counting.
- `setInterval`.
- `requestAnimationFrame`.
- Ring, dot, or arc drawing.
- `elapsedTime`, `activeSegments`, or `timerState`.
- Button event listeners.
- Mouse-wheel zoom logic.
- Animation code.
- Code comments that describe accumulated focus-time behavior.

## Step 2 - Control Styling

Refine the control bar spacing, typography, button states, and responsive layout.

Acceptance criteria:

- Controls remain readable on desktop and narrow viewports.
- Buttons use the system monospace font stack.
- Buttons are visually quiet and consistent with the design palette.
- No timer logic is added yet unless Step 4 is being implemented in the same explicit task.

## Step 3 - Static SVG Dotted Rings

Render the initial concentric dotted rings with SVG.

Acceptance criteria:

- Use SVG, not Canvas.
- Rings are concentric.
- The center is slightly below the vertical midpoint.
- The base state is dotted only.
- Dots use consistent visual size.
- No accent arcs are drawn yet.

## Step 4 - Global Elapsed Timer

Implement `elapsedTime` and `timerState`.

Acceptance criteria:

- START from idle begins elapsed time at 0.
- PAUSE does not reset elapsed time.
- RESET clears elapsed time and returns the timer display to `00:00`.
- The MVP display format is `mm:ss`, starting at `00:00`.

## Step 5 - Active Segments

Implement `activeSegments`.

Acceptance criteria:

- START while paused creates a new active segment at the current `elapsedTime`.
- PAUSE closes the current active segment at the current `elapsedTime`.
- RESET clears all active segments.
- Do not draw arcs based only on accumulated focus time.

## Step 6 - Accent Arcs on the Global Timeline

Draw accent arcs only for `activeSegments` on the global elapsed timeline.

Acceptance criteria:

- Paused intervals remain dotted.
- Restarting after PAUSE draws from the current elapsed-time position.
- The second segment must not visually attach to the first segment unless there was no paused interval.
- Accent arcs begin at 12 o'clock and move clockwise.

## Step 7 - Mouse-Wheel Zoom

Implement mouse-wheel zoom around the cursor position.

Acceptance criteria:

- Scrolling down zooms in.
- Scrolling up zooms out.
- The zoom origin follows the cursor position.
- The layout remains stable after zooming.

## Step 8 - Polish

Polish colors, typography, spacing, and responsive behavior.

Acceptance criteria:

- The page feels quiet, minimal, and focused.
- Text does not overlap controls or the SVG stage.
- The interface remains usable in desktop browsers.

## Step 9 - Build and Deployment Prep

Run the local and production checks.

Acceptance criteria:

- `npm run dev` serves the app locally.
- `npm run build` succeeds.
- No TypeScript errors remain.
- No runtime console errors appear during normal use.
