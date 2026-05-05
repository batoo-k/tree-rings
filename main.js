'use strict';

// ── Constants ─────────────────────────────────────────────────
const SECONDS_PER_DOT = 2;
const INNER_DOT_COUNT = 10;
const RING_COUNT      = 9;
const DOT_RADIUS      = 2;
const ACCENT_WIDTH    = 5;
const COLOR_DOT       = '#4A4945';
const COLOR_ACCENT    = '#D6A15C';
const SVG_NS          = 'http://www.w3.org/2000/svg';

// ── State ─────────────────────────────────────────────────────
const state = {
  phase:    'idle',   // 'idle' | 'running' | 'paused'
  elapsed:  0,        // seconds (float)
  segments: [],       // [{ start: number, end: number|null }]
  zoom:     { k: 1, x: 0, y: 0 },
};

// ── Ring geometry (recomputed on resize) ──────────────────────
let rings = [];  // [{ r, n, t0 }]
let cx = 0, cy = 0;

function buildRings() {
  const stage  = document.getElementById('ring-stage');
  const w      = stage.clientWidth;
  const h      = stage.clientHeight;
  cx           = w / 2;
  cy           = h / 2;
  const minDim = Math.min(w, h);
  const baseR  = minDim * 0.07;
  const gapR   = minDim * 0.044;

  rings = [];
  let t = 0;
  for (let i = 0; i < RING_COUNT; i++) {
    const r = baseR + i * gapR;
    const n = Math.max(3, Math.round((r / baseR) * INNER_DOT_COUNT));
    rings.push({ r, n, t0: t });
    t += n * SECONDS_PER_DOT;
  }
}

function ringDur(ring) { return ring.n * SECONDS_PER_DOT; }

// ── SVG helpers ───────────────────────────────────────────────
function el(tag, attrs) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

// angle = clockwise radians from 12 o'clock (top)
function toXY(r, angle) {
  return [cx + r * Math.sin(angle), cy - r * Math.cos(angle)];
}

function arcPath(r, a0, a1) {
  const [x0, y0] = toXY(r, a0);
  const [x1, y1] = toXY(r, a1);
  const large    = (a1 - a0 > Math.PI) ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

// ── SVG layer setup ───────────────────────────────────────────
const stage   = document.getElementById('ring-stage');
const grp     = el('g', {});
const baseG   = el('g', {});
const accentG = el('g', {});
grp.appendChild(baseG);
grp.appendChild(accentG);
stage.appendChild(grp);

// ── DOM refs ──────────────────────────────────────────────────
const timerEl  = document.getElementById('timer-display');
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');

// ── Render: dotted base rings (Step 3) ────────────────────────
function drawBase() {
  baseG.innerHTML = '';
  for (const ring of rings) {
    for (let d = 0; d < ring.n; d++) {
      const angle  = (d / ring.n) * 2 * Math.PI;
      const [x, y] = toXY(ring.r, angle);
      baseG.appendChild(el('circle', {
        cx: x, cy: y, r: DOT_RADIUS, fill: COLOR_DOT,
      }));
    }
  }
}

// ── Render: accent arcs (Step 6) ─────────────────────────────
// Draws smooth arcs only for activeSegments on the global elapsed timeline.
// Paused gaps remain dotted — no arc is drawn for time not in a segment.
function drawAccents() {
  accentG.innerHTML = '';
  const now = state.elapsed;

  for (const seg of state.segments) {
    const s0 = seg.start;
    const s1 = seg.end !== null ? seg.end : now;
    if (s1 <= s0) continue;

    for (const ring of rings) {
      const r0  = ring.t0;
      const r1  = ring.t0 + ringDur(ring);
      const o0  = Math.max(s0, r0);
      const o1  = Math.min(s1, r1);
      if (o0 >= o1) continue;

      const dur = ringDur(ring);
      const a0  = ((o0 - r0) / dur) * 2 * Math.PI;
      const a1  = ((o1 - r0) / dur) * 2 * Math.PI;

      if (a1 - a0 >= 2 * Math.PI - 1e-4) {
        // Full ring: SVG path can't represent 360° — use circle stroke
        accentG.appendChild(el('circle', {
          cx, cy, r: ring.r,
          fill: 'none', stroke: COLOR_ACCENT, 'stroke-width': ACCENT_WIDTH,
        }));
      } else {
        accentG.appendChild(el('path', {
          d: arcPath(ring.r, a0, a1),
          fill: 'none', stroke: COLOR_ACCENT,
          'stroke-width': ACCENT_WIDTH, 'stroke-linecap': 'round',
        }));
      }
    }
  }
}

// ── Timer display (Step 4) ────────────────────────────────────
function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateDisplay() { timerEl.textContent = fmt(state.elapsed); }

// ── Button enabled state ──────────────────────────────────────
function syncUI() {
  btnStart.disabled = state.phase === 'running';
  btnPause.disabled = state.phase !== 'running';
}

// ── RAF loop — elapsed time counts in all non-idle states ─────
let rafId  = null;
let lastTs = null;

function tick(ts) {
  if (lastTs !== null) state.elapsed += (ts - lastTs) / 1000;
  lastTs = ts;
  updateDisplay();
  drawAccents();
  rafId = requestAnimationFrame(tick);
}

// ── Controls (Step 4 + 5) ─────────────────────────────────────
function onStart() {
  if (state.phase === 'running') return;
  const first = state.phase === 'idle';
  state.phase = 'running';
  // New segment begins at current elapsed position (not at accumulated focus time)
  state.segments.push({ start: state.elapsed, end: null });
  syncUI();
  if (first) { lastTs = null; rafId = requestAnimationFrame(tick); }
}

function onPause() {
  if (state.phase !== 'running') return;
  state.phase = 'paused';
  // Close the current segment; elapsed time continues counting in RAF
  const seg = state.segments[state.segments.length - 1];
  if (seg && seg.end === null) seg.end = state.elapsed;
  syncUI();
  // RAF intentionally not cancelled — paused gap shows as dotted on rings
}

function onReset() {
  cancelAnimationFrame(rafId);
  rafId = null; lastTs = null;
  state.phase    = 'idle';
  state.elapsed  = 0;
  state.segments = [];
  state.zoom     = { k: 1, x: 0, y: 0 };
  grp.removeAttribute('transform');
  updateDisplay();
  drawAccents();
  syncUI();
}

btnStart.addEventListener('click', onStart);
btnPause.addEventListener('click', onPause);
btnReset.addEventListener('click', onReset);

// ── Mouse-wheel zoom (Step 7) ─────────────────────────────────
// Scroll down = zoom in, scroll up = zoom out, centered on cursor
function applyZoom() {
  const { k, x, y } = state.zoom;
  grp.setAttribute('transform', `translate(${x},${y}) scale(${k})`);
}

stage.addEventListener('wheel', e => {
  e.preventDefault();
  const rect   = stage.getBoundingClientRect();
  const mx     = e.clientX - rect.left;
  const my     = e.clientY - rect.top;
  const factor = e.deltaY > 0 ? 1.1 : 1 / 1.1;
  const nk     = Math.min(8, Math.max(0.2, state.zoom.k * factor));
  const ratio  = nk / state.zoom.k;
  state.zoom.x = mx - ratio * (mx - state.zoom.x);
  state.zoom.y = my - ratio * (my - state.zoom.y);
  state.zoom.k = nk;
  applyZoom();
}, { passive: false });

// ── Resize ────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  state.zoom = { k: 1, x: 0, y: 0 };
  grp.removeAttribute('transform');
  buildRings();
  drawBase();
  drawAccents();
});

// ── Init ──────────────────────────────────────────────────────
buildRings();
drawBase();
updateDisplay();
syncUI();
