"use client";

import { useEffect, useState } from "react";

type Phase = "idle" | "running" | "paused";

type ActiveSegment = {
  start: number;
  end: number | null;
};

type Ring = {
  radius: number;
  dots: number;
  startTime: number;
};

type DotPoint = {
  key: string;
  x: number;
  y: number;
};

const SECONDS_PER_DOT = 2;
const INNER_DOT_COUNT = 10;
const RING_COUNT = 30;
const CENTER = 220;
const INNER_RADIUS = 36;
const RING_GAP = 22;
const DOT_RADIUS = 2;
const ACCENT_WIDTH = 5;
const INITIAL_VIEW_BOX = "-77 -77 594 594";

function buildRings() {
  const rings: Ring[] = [];
  let startTime = 0;

  for (let index = 0; index < RING_COUNT; index += 1) {
    const radius = INNER_RADIUS + index * RING_GAP;
    const dots = Math.max(
      3,
      Math.round((radius / INNER_RADIUS) * INNER_DOT_COUNT),
    );

    rings.push({ radius, dots, startTime });
    startTime += dots * SECONDS_PER_DOT;
  }

  return rings;
}

function ringDuration(ring: Ring) {
  return ring.dots * SECONDS_PER_DOT;
}

function formatTime(seconds: number) {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function pointOnRing(radius: number, angle: number) {
  return {
    x: CENTER + radius * Math.sin(angle),
    y: CENTER - radius * Math.cos(angle),
  };
}

function arcPath(radius: number, startAngle: number, endAngle: number) {
  const start = pointOnRing(radius, startAngle);
  const end = pointOnRing(radius, endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

const STATIC_RINGS = buildRings();

function buildDotPoints(rings: Ring[]) {
  return rings.flatMap((ring) =>
    Array.from({ length: ring.dots }, (_, dotIndex) => {
      const angle = (dotIndex / ring.dots) * Math.PI * 2;
      const point = pointOnRing(ring.radius, angle);

      return {
        key: `${ring.radius}-${dotIndex}`,
        x: point.x,
        y: point.y,
      };
    }),
  );
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeSegments, setActiveSegments] = useState<ActiveSegment[]>([]);
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 });
  const [dotPoints, setDotPoints] = useState<DotPoint[]>([]);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setDotPoints(buildDotPoints(STATIC_RINGS));
      setIsMounted(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!isMounted || phase === "idle") {
      return;
    }

    let frameId = 0;
    let previousTimestamp: number | null = null;

    const tick = (timestamp: number) => {
      if (previousTimestamp !== null) {
        const delta = (timestamp - previousTimestamp) / 1000;
        setElapsedTime((current) => current + delta);
      }

      previousTimestamp = timestamp;
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isMounted, phase]);

  const handleStart = () => {
    if (phase === "running") {
      return;
    }

    setActiveSegments((segments) => [
      ...segments,
      { start: elapsedTime, end: null },
    ]);
    setPhase("running");
  };

  const handlePause = () => {
    if (phase !== "running") {
      return;
    }

    setActiveSegments((segments) =>
      segments.map((segment, index) =>
        index === segments.length - 1 && segment.end === null
          ? { ...segment, end: elapsedTime }
          : segment,
      ),
    );
    setPhase("paused");
  };

  const handleReset = () => {
    setPhase("idle");
    setElapsedTime(0);
    setActiveSegments([]);
    setZoom({ scale: 1, x: 0, y: 0 });
  };

  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();

    const bounds = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - bounds.left;
    const mouseY = event.clientY - bounds.top;
    const factor = event.deltaY > 0 ? 1.1 : 1 / 1.1;

    setZoom((current) => {
      const nextScale = Math.min(8, Math.max(0.2, current.scale * factor));
      const ratio = nextScale / current.scale;

      return {
        scale: nextScale,
        x: mouseX - ratio * (mouseX - current.x),
        y: mouseY - ratio * (mouseY - current.y),
      };
    });
  };

  const visibleSegments = isMounted
    ? activeSegments.map((segment) => ({
        start: segment.start,
        end: segment.end ?? elapsedTime,
      }))
    : [];

  return (
    <main className="tree-page">
      <header className="tree-controls" aria-label="Timer controls">
        <div className="timer-display" aria-live="polite">
          {formatTime(elapsedTime)}
        </div>

        <div className="button-row">
          <button
            className="timer-button"
            type="button"
            onClick={() => setIsAboutOpen(true)}
          >
            ABOUT
          </button>
          <button
            className="timer-button"
            type="button"
            onClick={handleStart}
            disabled={phase === "running"}
          >
            START
          </button>
          <button
            className="timer-button"
            type="button"
            onClick={handlePause}
            disabled={phase !== "running"}
          >
            PAUSE
          </button>
          <button className="timer-button" type="button" onClick={handleReset}>
            RESET
          </button>
        </div>
      </header>

      <section className="ring-area" aria-label="Tree rings timeline">
        <svg
          className="ring-stage"
          viewBox={INITIAL_VIEW_BOX}
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="Concentric tree rings timer visualization"
          onWheel={handleWheel}
        >
          {isMounted && (
            <g
              transform={`translate(${zoom.x} ${zoom.y}) scale(${zoom.scale})`}
            >
              <g>
                {dotPoints.map((point) => (
                  <circle
                    key={point.key}
                    cx={point.x}
                    cy={point.y}
                    r={DOT_RADIUS}
                    fill="#4A4945"
                  />
                ))}
              </g>

              <g>
                {visibleSegments.flatMap((segment, segmentIndex) =>
                  STATIC_RINGS.flatMap((ring) => {
                    const ringStart = ring.startTime;
                    const ringEnd = ring.startTime + ringDuration(ring);
                    const overlapStart = Math.max(segment.start, ringStart);
                    const overlapEnd = Math.min(segment.end, ringEnd);

                    if (overlapStart >= overlapEnd) {
                      return [];
                    }

                    const duration = ringDuration(ring);
                    const startAngle =
                      ((overlapStart - ringStart) / duration) * Math.PI * 2;
                    const endAngle =
                      ((overlapEnd - ringStart) / duration) * Math.PI * 2;
                    const key = `${segmentIndex}-${ring.radius}`;

                    if (endAngle - startAngle >= Math.PI * 2 - 0.0001) {
                      return (
                        <circle
                          key={key}
                          cx={CENTER}
                          cy={CENTER}
                          r={ring.radius}
                          fill="none"
                          stroke="#D6A15C"
                          strokeWidth={ACCENT_WIDTH}
                        />
                      );
                    }

                    return (
                      <path
                        key={key}
                        d={arcPath(ring.radius, startAngle, endAngle)}
                        fill="none"
                        stroke="#D6A15C"
                        strokeLinecap="round"
                        strokeWidth={ACCENT_WIDTH}
                      />
                    );
                  }),
                )}
              </g>
            </g>
          )}
        </svg>
      </section>

      <div className="project-mark" aria-label="Project name and build check">
        <div className="project-name">Tree Rings</div>
        <div className="build-test">build test 2026-05-05</div>
      </div>

      {isAboutOpen && (
        <div className="about-backdrop" role="presentation">
          <section
            className="about-dialog"
            role="dialog"
            aria-modal="false"
            aria-labelledby="about-title"
          >
            <button
              className="about-close"
              type="button"
              aria-label="Close about dialog"
              onClick={() => setIsAboutOpen(false)}
            >
              ×
            </button>
            <h2 id="about-title">Tree Rings</h2>
            <p>
              Tree Rings is a visual count-up timer inspired by the quiet growth
              of tree rings. Time moves along a global elapsed timeline while
              focused intervals are drawn as warm accent arcs.
            </p>
            <p>
              Paused intervals stay dotted, so each ring preserves both focused
              time and the spaces between it.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
