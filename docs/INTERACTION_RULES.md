# Interaction Rules

## Buttons

### START

START begins or resumes focus recording.

If the timer is idle, START begins elapsedTime from 0.
If the timer is paused, START starts a new active segment at the current elapsedTime.

### PAUSE

PAUSE stops focus recording but does not stop elapsedTime.

The current active segment should be closed at the current elapsedTime.

### RESET

RESET clears elapsedTime, activeSegments, zoom state, and returns the interface to the default dotted ring state.

## Mouse Wheel Zoom

The user can zoom in and out using the mouse wheel.

- Scrolling down zooms in.
- Scrolling up zooms out.
- Zooming should happen around the mouse cursor position.