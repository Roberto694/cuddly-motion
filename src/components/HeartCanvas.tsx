import { useEffect, useRef } from "react";

/** Particle heart that pulses — ported from the classic canvas heart effect. */
export function HeartCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const koef = mobile ? 0.6 : 1;
    let width = (canvas.width = koef * window.innerWidth);
    let height = (canvas.height = koef * window.innerHeight);
    const rand = Math.random;

    const heartPosition = (rad: number): [number, number] => [
      Math.pow(Math.sin(rad), 3),
      -(
        15 * Math.cos(rad) -
        5 * Math.cos(2 * rad) -
        2 * Math.cos(3 * rad) -
        Math.cos(4 * rad)
      ),
    ];
    const st = (
      pos: [number, number],
      sx: number,
      sy: number,
    ): [number, number] => [pos[0] * sx, pos[1] * sy];

    const traceCount = mobile ? 20 : 50;
    const pointsOrigin: [number, number][] = [];
    const dr = mobile ? 0.3 : 0.1;
    for (let i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(st(heartPosition(i), 210, 13));
    for (let i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(st(heartPosition(i), 150, 9));
    for (let i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(st(heartPosition(i), 90, 5));
    const heartPointsCount = pointsOrigin.length;

    const targetPoints: [number, number][] = [];
    const pulse = (kx: number, ky: number) => {
      for (let i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [
          kx * pointsOrigin[i]![0] + width / 2,
          ky * pointsOrigin[i]![1] + height / 2,
        ];
      }
    };

    type P = {
      vx: number;
      vy: number;
      speed: number;
      q: number;
      D: number;
      force: number;
      f: string;
      trace: { x: number; y: number }[];
    };
    const e: P[] = [];
    for (let i = 0; i < heartPointsCount; i++) {
      const x = rand() * width;
      const y = rand() * height;
      const trace = Array.from({ length: traceCount }, () => ({ x, y }));
      e.push({
        vx: 0,
        vy: 0,
        speed: rand() + 5,
        q: ~~(rand() * heartPointsCount),
        D: 2 * (i % 2) - 1,
        force: 0.2 * rand() + 0.7,
        f: `hsla(${~~(350 + 20 * rand())},${~~(40 * rand() + 100)}%,${~~(60 * rand() + 25)}%,.32)`,
        trace,
      });
    }

    const traceK = 0.4;
    const timeDelta = 0.01;
    let time = 0;
    let raf = 0;

    const onResize = () => {
      width = canvas.width = koef * window.innerWidth;
      height = canvas.height = koef * window.innerHeight;
      ctx.clearRect(0, 0, width, height);
    };
    window.addEventListener("resize", onResize);

    const loop = () => {
      const n = -Math.cos(time);
      pulse((1 + n) * 0.5, (1 + n) * 0.5);
      time += (Math.sin(time) < 0 ? 9 : n > 0.8 ? 0.2 : 1) * timeDelta;
      ctx.clearRect(0, 0, width, height);
      for (let i = e.length; i--; ) {
        const u = e[i]!;
        const q = targetPoints[u.q]!;
        const dx = u.trace[0]!.x - q[0];
        const dy = u.trace[0]!.y - q[1];
        const length = Math.sqrt(dx * dx + dy * dy) || 1;
        if (length < 10) {
          if (rand() > 0.95) {
            u.q = ~~(rand() * heartPointsCount);
          } else {
            if (rand() > 0.99) u.D *= -1;
            u.q = (u.q + u.D + heartPointsCount) % heartPointsCount;
          }
        }
        u.vx += (-dx / length) * u.speed;
        u.vy += (-dy / length) * u.speed;
        u.trace[0]!.x += u.vx;
        u.trace[0]!.y += u.vy;
        u.vx *= u.force;
        u.vy *= u.force;
        for (let k = 0; k < u.trace.length - 1; ) {
          const T = u.trace[k]!;
          const N = u.trace[++k]!;
          N.x -= traceK * (N.x - T.x);
          N.y -= traceK * (N.y - T.y);
        }
        ctx.fillStyle = u.f;
        for (let k = 0; k < u.trace.length; k++) {
          ctx.fillRect(u.trace[k]!.x, u.trace[k]!.y, 1, 1);
        }
      }
      raf = window.requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="heart-canvas" aria-hidden="true" />;
}
