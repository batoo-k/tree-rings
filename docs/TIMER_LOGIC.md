# Timer Logic

Tree Rings must render active focus periods based on the global elapsed timeline.

It must not connect accumulated focus time into one continuous arc.

## Core Timeline Rule

- elapsedTime controls the current position on the visual rings.
- activeSegments controls which parts of the elapsed timeline are drawn as accent arcs.
- Any time interval that is not inside activeSegments remains dotted.

## Example

If the user does this:

- START from 0s to 10s
- PAUSE from 10s to 20s
- START again from 20s onward

The visual result must be:

- 0s to 10s: accent arc
- 10s to 20s: dotted only
- 20s onward: accent arc

The second accent arc must begin at the 20s position, not at the 10s position.

## Suggested State

```ts
type TimerState = "idle" | "running" | "paused";

type ActiveSegment = {
  start: number;
  end: number | null;
};

const secondsPerDot = 2;
const innerRingDotCount = 10;
```

Use these names when implementing the timer logic after the static layout step.
Do not introduce them during Step 1.

## Step Boundaries

Step 1 is static UI only.
It must not include `elapsedTime`, `activeSegments`, `timerState`, `setInterval`, `requestAnimationFrame`, button event listeners, animation code, or zoom code.

The global elapsed timeline rule begins in the timer implementation steps, not in the first static layout step.
