import { useEffect, useMemo, useRef, useState } from "react";

type Layer = { count: number; w: number; h: number; offset: number; color: string; z: number };

/* Petal rings, from the widest outer ring to the tight dark centre. */
const LAYERS: Layer[] = [
  { count: 12, w: 108, h: 122, offset: 0, color: "#e01c39", z: 1 },
  { count: 11, w: 94, h: 108, offset: 16, color: "#cf1732", z: 2 },
  { count: 9, w: 80, h: 92, offset: 8, color: "#bb122b", z: 3 },
  { count: 8, w: 66, h: 76, offset: 22, color: "#a50f25", z: 4 },
  { count: 6, w: 52, h: 60, offset: 12, color: "#8d0c1f", z: 5 },
  { count: 5, w: 38, h: 44, offset: 30, color: "#75091a", z: 6 },
];

const STATUS = [
  "Loading Love.css ...",
  "Growing digital petals ...",
  "Almost in bloom ...",
  "Ready to bloom!",
];

export default function BloomingRose() {
  const [progress, setProgress] = useState(0);
  const [bloomed, setBloomed] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (timer.current) clearInterval(timer.current);
          return 100;
        }
        return Math.min(100, p + 2);
      });
    }, 70);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const ready = progress >= 100;
  const status = ready ? STATUS[3] : STATUS[Math.min(2, Math.floor(progress / 34))];

  const petals = useMemo(
    () =>
      LAYERS.flatMap((layer, li) => {
        const step = 360 / layer.count;
        return Array.from({ length: layer.count }, (_, i) => {
          const angle = layer.offset + i * step + (Math.random() - 0.5) * 5;
          return {
            key: `${li}-${i}`,
            angle,
            delay: 1.35 + li * 0.34 + i * 0.035,
            w: layer.w,
            h: layer.h,
            color: layer.color,
            z: layer.z,
            curl: 42 + li * 3,
          };
        });
      }),
    [],
  );

  const sparks = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 9,
        dur: 7 + Math.random() * 6,
        size: 2 + Math.random() * 3,
      })),
    [],
  );

  return (
    <div className="rose-scene">
      <div className="rose-glow" aria-hidden="true" />

      {!bloomed && (
        <div className="love-card">
          <div className="love-card-emoji">🌹</div>
          <h1 className="love-card-title">Love.css</h1>
          <div className="love-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="love-status">{status}</p>
          <button
            type="button"
            className="love-btn"
            disabled={!ready}
            onClick={() => setBloomed(true)}
          >
            TAP TO BLOOM
          </button>
        </div>
      )}

      {bloomed && (
        <div className="rose-stage">
          <div className="rose-plant">
            <div className="rose-flower">
              <div className="rose-bud" aria-hidden="true" />
              {petals.map((p) => (
                <span
                  key={p.key}
                  className="rose-petal"
                  style={
                    {
                      "--a": `${p.angle}deg`,
                      "--d": `${p.delay}s`,
                      "--w": `${p.w}px`,
                      "--h": `${p.h}px`,
                      "--c": p.color,
                      "--z": p.z,
                      "--curl": `${p.curl}%`,
                    } as React.CSSProperties
                  }
                />
              ))}
              <span className="rose-core" />
            </div>

            <div className="rose-stem">
              <span className="rose-leaf rose-leaf-left" />
              <span className="rose-leaf rose-leaf-right" />
            </div>
          </div>

          <p className="rose-message">
            i coded this for
            <span className="rose-message-you">you</span>
            <span className="rose-message-emoji">🌹</span>
          </p>
        </div>
      )}

      <div className="rose-sparks" aria-hidden="true">
        {sparks.map((s, i) => (
          <span
            key={i}
            style={{
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
