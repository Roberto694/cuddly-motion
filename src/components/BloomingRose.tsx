import { useMemo } from "react";

/**
 * Side-view petal: anchored at its base (0,0), tip pointing up (-y).
 * Curved, slightly asymmetric like a real rose petal.
 */
function Petal({
  angle,
  length,
  width,
  delay,
  grad,
  sway = false,
}: {
  angle: number;
  length: number;
  width: number;
  delay: number;
  grad: string;
  sway?: boolean;
}) {
  return (
    <g transform={`rotate(${angle})`}>
      <path
        d={`M 0 0
            C ${-width * 0.9} ${-length * 0.28},
              ${-width} ${-length * 0.72},
              ${-width * 0.28} ${-length}
            Q 0 ${-length - width * 0.22}, ${width * 0.28} ${-length}
            C ${width} ${-length * 0.72},
              ${width * 0.9} ${-length * 0.28},
              0 0 Z`}
        fill={grad}
        className={sway ? "rose-petal rose-petal-sway" : "rose-petal"}
        style={{ animationDelay: `${delay}s` }}
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

export function BloomingRose() {
  // Cup layers (side view): petals flare outward only within a fan,
  // back → middle → front, like the reference video.
  const layers = useMemo(
    () => [
      // Back row: tall, darker, mostly upright
      { angles: [-52, -26, 0, 26, 52], length: 98, width: 34, base: 1.6, grad: "url(#petalBack)" },
      // Middle row: main body of the cup
      { angles: [-84, -56, -28, 0, 28, 56, 84], length: 84, width: 36, base: 2.2, grad: "url(#petalMid)" },
      // Front row: shorter, flaring wide open, brighter edges
      { angles: [-108, -72, -36, 0, 36, 72, 108], length: 62, width: 34, base: 2.9, grad: "url(#petalFront)" },
    ],
    [],
  );

  const falling = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        left: 8 + ((i * 101) % 84),
        delay: 4 + i * 2.1,
        duration: 8 + ((i * 37) % 5),
        size: 13 + ((i * 13) % 11),
      })),
    [],
  );

  return (
    <div className="rose-scene">
      {/* Ambient glow behind the rose */}
      <div className="rose-glow" />

      {/* Falling petals */}
      {falling.map((p, i) => (
        <FallingPetal key={i} {...p} />
      ))}

      <svg
        viewBox="-150 -250 300 440"
        className="rose-svg"
        role="img"
        aria-label="Una rosa roja floreciendo"
      >
        <defs>
          <radialGradient id="petalBack" cx="50%" cy="85%" r="105%">
            <stop offset="0%" stopColor="oklch(0.26 0.11 18)" />
            <stop offset="60%" stopColor="oklch(0.42 0.18 20)" />
            <stop offset="100%" stopColor="oklch(0.52 0.21 22)" />
          </radialGradient>
          <radialGradient id="petalMid" cx="50%" cy="85%" r="105%">
            <stop offset="0%" stopColor="oklch(0.32 0.14 18)" />
            <stop offset="55%" stopColor="oklch(0.5 0.21 21)" />
            <stop offset="100%" stopColor="oklch(0.62 0.24 24)" />
          </radialGradient>
          <radialGradient id="petalFront" cx="50%" cy="85%" r="105%">
            <stop offset="0%" stopColor="oklch(0.36 0.16 19)" />
            <stop offset="55%" stopColor="oklch(0.55 0.23 23)" />
            <stop offset="100%" stopColor="oklch(0.68 0.24 26)" />
          </radialGradient>
          <linearGradient id="stemGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.34 0.09 145)" />
            <stop offset="50%" stopColor="oklch(0.52 0.13 145)" />
            <stop offset="100%" stopColor="oklch(0.32 0.08 145)" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.58 0.14 145)" />
            <stop offset="100%" stopColor="oklch(0.38 0.11 148)" />
          </linearGradient>
        </defs>

        {/* Straight vertical stem — grows upward */}
        <path
          d="M 0 185 L 0 -52"
          fill="none"
          stroke="url(#stemGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          className="rose-stem"
        />

        {/* Two rounded leaves, like the reference: left higher, right lower */}
        <g className="rose-leaf rose-leaf-left">
          <path
            d="M -3 92 C -30 90, -52 74, -60 52 C -38 52, -12 66, -3 92 Z"
            fill="url(#leafGrad)"
          />
        </g>
        <g className="rose-leaf rose-leaf-right">
          <path
            d="M 3 138 C 30 136, 52 120, 60 98 C 38 98, 12 112, 3 138 Z"
            fill="url(#leafGrad)"
          />
        </g>

        {/* Bloom head — sways gently once open */}
        <g className="rose-head">
          <g transform="translate(0,-52)">
            {/* Green calyx bud: appears first, petals burst out of it */}
            <g className="rose-calyx">
              {[-40, -14, 14, 40].map((a, i) => (
                <g key={i} transform={`rotate(${a})`}>
                  <path
                    d="M 0 4 C -8 -6, -6 -22, 0 -32 C 6 -22, 8 -6, 0 4 Z"
                    fill="oklch(0.42 0.12 146)"
                  />
                </g>
              ))}
            </g>

            {/* Petal cup layers */}
            {layers.map((layer, li) =>
              layer.angles.map((angle, pi) => (
                <Petal
                  key={`${li}-${pi}`}
                  angle={angle}
                  length={layer.length}
                  width={layer.width}
                  delay={layer.base + pi * 0.09}
                  grad={layer.grad}
                />
              )),
            )}

            {/* Inner swirl heart of the rose */}
            <circle
              cx="0"
              cy="-26"
              r="16"
              fill="oklch(0.3 0.13 18)"
              className="rose-heart"
            />
            <path
              d="M -9 -26 a 9 9 0 1 1 14 7 a 6 6 0 1 0 -9 -5"
              fill="none"
              stroke="oklch(0.56 0.22 23)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="rose-heart"
            />
          </g>
        </g>
      </svg>

      {/* Message */}
      <p className="rose-message">
        i coded this for <span className="rose-message-you">you</span>
        <span className="rose-message-emoji">🌹</span>
      </p>
    </div>
  );
}
