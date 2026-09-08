import { useMemo } from "react";

/** A single petal: a soft rounded teardrop drawn with bezier curves. */
function Petal({
  angle,
  length,
  width,
  delay,
  hue,
  index,
}: {
  angle: number;
  length: number;
  width: number;
  delay: number;
  hue: number;
  index: number;
}) {
  return (
    <g transform={`rotate(${angle})`}>
      <path
        d={`M 0 0 C ${-width} ${-length * 0.35}, ${-width * 0.9} ${-length * 0.85}, 0 ${-length}
            C ${width * 0.9} ${-length * 0.85}, ${width} ${-length * 0.35}, 0 0 Z`}
        fill={`url(#petalGrad${hue})`}
        className="rose-petal"
        style={{
          animationDelay: `${delay}s`,
          transformOrigin: "0px 0px",
        }}
        data-index={index}
      />
    </g>
  );
}

/** Falling petal drifting across the screen. */
function FallingPetal({
  left,
  delay,
  duration,
  size,
}: {
  left: number;
  delay: number;
  duration: number;
  size: number;
}) {
  return (
    <svg
      viewBox="-10 -20 20 24"
      width={size}
      height={size * 1.2}
      className="falling-petal"
      style={{
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <path
        d="M 0 3 C -9 -6, -8 -16, 0 -19 C 8 -16, 9 -6, 0 3 Z"
        fill="oklch(0.55 0.22 20 / 0.85)"
      />
    </svg>
  );
}

export function BloomingRose({
  embedded = false,
  showMessage = true,
}: {
  embedded?: boolean;
  showMessage?: boolean;
}) {
  // Petal layers: outer layers bloom first, inner ones later.
  const layers = useMemo(
    () => [
      { count: 8, length: 118, width: 46, offset: 0, hue: 0, base: 0.6 },
      { count: 7, length: 96, width: 42, offset: 22, hue: 1, base: 1.4 },
      { count: 6, length: 74, width: 36, offset: 10, hue: 2, base: 2.2 },
      { count: 5, length: 52, width: 30, offset: 40, hue: 3, base: 3.0 },
      { count: 4, length: 32, width: 22, offset: 5, hue: 4, base: 3.8 },
    ],
    [],
  );

  const falling = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        left: 5 + ((i * 97) % 90),
        delay: 3 + i * 1.7,
        duration: 7 + ((i * 31) % 5),
        size: 14 + ((i * 13) % 12),
      })),
    [],
  );

  return (
    <div className={embedded ? "rose-scene rose-scene--embedded" : "rose-scene"}>
      {/* Ambient glow behind the rose */}
      <div className="rose-glow" />

      {/* Falling petals */}
      {falling.map((p, i) => (
        <FallingPetal key={i} {...p} />
      ))}

      <svg
        viewBox="-160 -260 320 460"
        className="rose-svg"
        role="img"
        aria-label="Una rosa roja floreciendo"
      >
        <defs>
          {[0, 1, 2, 3, 4].map((h) => (
            <radialGradient
              key={h}
              id={`petalGrad${h}`}
              cx="50%"
              cy="90%"
              r="110%"
            >
              <stop
                offset="0%"
                stopColor={`oklch(${0.28 + h * 0.05} 0.14 18)`}
              />
              <stop
                offset="55%"
                stopColor={`oklch(${0.45 + h * 0.04} 0.2 20)`}
              />
              <stop
                offset="100%"
                stopColor={`oklch(${0.58 + h * 0.03} 0.23 22)`}
              />
            </radialGradient>
          ))}
          <linearGradient id="stemGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.32 0.09 145)" />
            <stop offset="50%" stopColor="oklch(0.45 0.12 145)" />
            <stop offset="100%" stopColor="oklch(0.3 0.08 145)" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.52 0.13 145)" />
            <stop offset="100%" stopColor="oklch(0.34 0.1 148)" />
          </linearGradient>
        </defs>

        {/* Stem — grows upward */}
        <g className="rose-stem-group">
          <path
            d="M 0 190 C -4 130, 5 60, 0 -60"
            fill="none"
            stroke="url(#stemGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            className="rose-stem"
          />
          {/* Leaves */}
          <g className="rose-leaf rose-leaf-left">
            <path
              d="M -2 96 C -34 82, -52 58, -56 34 C -30 42, -8 62, -2 96 Z"
              fill="url(#leafGrad)"
            />
            <path
              d="M -6 88 C -24 74, -38 58, -46 44"
              fill="none"
              stroke="oklch(0.3 0.08 148)"
              strokeWidth="1.5"
            />
          </g>
          <g className="rose-leaf rose-leaf-right">
            <path
              d="M 2 140 C 32 128, 50 106, 55 84 C 30 90, 9 108, 2 140 Z"
              fill="url(#leafGrad)"
            />
            <path
              d="M 6 132 C 24 118, 38 104, 46 92"
              fill="none"
              stroke="oklch(0.3 0.08 148)"
              strokeWidth="1.5"
            />
          </g>
        </g>

        {/* Bloom head — swaying gently */}
        <g className="rose-head">
          {/* Sepals under the bloom */}
          {[0, 72, 144, 216, 288].map((a) => (
            <g key={a} transform={`translate(0,-58) rotate(${a})`}>
              <path
                d="M 0 0 C -7 -10, -5 -24, 0 -34 C 5 -24, 7 -10, 0 0 Z"
                fill="oklch(0.36 0.1 146)"
                className="rose-sepal"
                style={{ animationDelay: "1.2s" }}
              />
            </g>
          ))}

          {/* Petal layers, outer first */}
          <g transform="translate(0,-58)">
            {layers.map((layer, li) =>
              Array.from({ length: layer.count }, (_, pi) => {
                const step = 360 / layer.count;
                const jitter = Math.sin(li * 7.3 + pi * 13.7) * 6;
                return (
                  <Petal
                    key={`${li}-${pi}`}
                    index={pi}
                    angle={layer.offset + pi * step + jitter}
                    length={layer.length}
                    width={layer.width}
                    hue={layer.hue}
                    delay={layer.base + pi * 0.12}
                  />
                );
              }),
            )}
          </g>
        </g>
      </svg>

      {showMessage && (
        <p className="rose-message">
          i coded this for <span className="rose-message-you">you</span>
          <span className="rose-message-emoji">🌹</span>
        </p>
      )}
    </div>
  );
}
