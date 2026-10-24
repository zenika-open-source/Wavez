interface WaveComponent {
  length: number;
  amplitude: number;
  modulationSpeed: number;
  modulationPhase: number;
  phase: number;
  direction: 1 | -1;
}

export interface WaveScene {
  front: WaveComponent[];
  mid: WaveComponent[];
  back: WaveComponent[];
  time: number;
  progress: number;
  zY: number | null;
  zAngle: number;
}

export interface WaveFrame {
  back: string;
  mid: string;
  front: string;
  z: { left: number; top: number; angle: number };
}

type Point = [number, number];

interface Surface {
  d: string;
  first: number;
  last: number;
  points: Point[];
}

const TAU = Math.PI * 2;
const Z_X = 262;
const Z_SPAN = 16;
export const Z_SIZE = 40;

function component(
  random: () => number,
  length: number,
  amplitude: number,
  modulationSpeed: number,
  direction: 1 | -1,
): WaveComponent {
  return {
    length,
    amplitude,
    modulationSpeed,
    modulationPhase: random() * TAU,
    phase: random() * TAU,
    direction,
  };
}

// Phases are random per load so no two visits look the same.
export function createWaveScene(random: () => number = Math.random): WaveScene {
  return {
    front: [
      component(random, 260, 0.48, 0.13, 1),
      component(random, 135, 0.28, 0.21, 1),
      component(random, 71, 0.14, 0.34, 1),
      component(random, 37, 0.08, 0.53, 1),
    ],
    back: [
      component(random, 190, 0.5, 0.11, -1),
      component(random, 95, 0.3, 0.19, -1),
      component(random, 52, 0.2, 0.29, -1),
    ],
    mid: [
      component(random, 210, 0.5, 0.12, 1),
      component(random, 110, 0.3, 0.2, 1),
      component(random, 58, 0.2, 0.3, 1),
    ],
    time: 0,
    progress: 0,
    zY: null,
    zAngle: 0,
  };
}

// Eases the displayed level towards the target and advances the wave clock; a higher level runs faster.
export function advanceWave(scene: WaveScene, target: number, dtSeconds: number): void {
  scene.progress += (target - scene.progress) * 0.07;
  scene.time += dtSeconds * (0.5 + 2.3 * scene.progress);
}

// Sum of travelling waves (Gerstner style): long swells run faster than short chop, crests sharpen and
// troughs flatten as the level rises, and each component's height drifts slowly, so it never repeats.
function surface(
  components: WaveComponent[],
  time: number,
  baseline: number,
  height: number,
  steepness: number,
  speed: number,
): Surface {
  const points: Point[] = [];
  let d = "";
  let first = 0;
  let last = 0;

  for (let x0 = -40; x0 <= 400; x0 += 4) {
    let dx = 0;
    let dy = 0;
    for (const c of components) {
      const k = TAU / c.length;
      const a = height * c.amplitude * (0.72 + 0.28 * Math.sin(c.modulationSpeed * time + c.modulationPhase));
      const theta = k * x0 - c.direction * speed * 3 * Math.sqrt(k) * time + c.phase;
      dx -= steepness * a * Math.sin(theta);
      dy += a * Math.cos(theta);
    }
    const x = x0 + dx;
    const y = baseline - dy;
    if (x0 === -40) first = x;
    last = x;
    points.push([x, y]);
    d += `${x0 === -40 ? "M" : " L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }

  return { d, first, last, points };
}

function surfaceAt(points: Point[], x: number): number {
  for (let i = 1; i < points.length; i++) {
    if (points[i][0] >= x) {
      const a = points[i - 1];
      const b = points[i];
      const u = (x - a[0]) / (b[0] - a[0] || 1);
      return a[1] + (b[1] - a[1]) * u;
    }
  }
  return points[points.length - 1][1];
}

function area(s: Surface): string {
  return `${s.d} L${s.last.toFixed(1)} 130 L${s.first.toFixed(1)} 130 Z`;
}

// Three opaque layers: the one in front is the darkest and hides the ones behind it.
// The Z rides the front wave about a quarter of its height under water, following the surface and its slope.
export function drawWave(scene: WaveScene, animated: boolean): WaveFrame {
  const p = scene.progress;
  const t = scene.time;
  const front = surface(scene.front, t, 74, 5 + 31 * p, 0.12 + 0.22 * p, 1);
  const mid = surface(scene.mid, t, 58, 4 + 24 * p, 0.1 + 0.22 * p, 0.8);
  const back = surface(scene.back, t, 44, 3 + 22 * p, 0.1 + 0.22 * p, 0.6);

  const yCenter =
    (surfaceAt(front.points, Z_X - Z_SPAN) + surfaceAt(front.points, Z_X) + surfaceAt(front.points, Z_X + Z_SPAN)) / 3;
  const slope = Math.atan2(
    surfaceAt(front.points, Z_X + Z_SPAN) - surfaceAt(front.points, Z_X - Z_SPAN),
    2 * Z_SPAN,
  );
  const angle = Math.max(-28, Math.min(28, (slope * 180) / Math.PI));

  if (scene.zY === null || !animated) {
    scene.zY = yCenter;
    scene.zAngle = angle;
  } else {
    scene.zY += (yCenter - scene.zY) * 0.3;
    scene.zAngle += (angle - scene.zAngle) * 0.3;
  }

  return {
    back: area(back),
    mid: area(mid),
    front: area(front),
    z: { left: Z_X / 3.6, top: scene.zY / 1.2, angle: scene.zAngle },
  };
}
