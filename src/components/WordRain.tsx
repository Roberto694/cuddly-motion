import { useMemo } from "react";

const PHRASES = [
  "Hermosa",
  "Preciosa",
  "Bellísima",
  "Radiante",
  "Encantadora",
  "Espectacular",
  "Deslumbrante",
  "Fascinante",
  "Perfecta",
  "Impresionante",
  "Divina",
  "Maravillosa",
  "Atractiva",
  "Elegante",
  "Exquisita",
  "Angelical",
  "Hipnotizante",
  "Increíblemente bella",
];

/** Soft rain of compliments drifting down the screen. */
export function WordRain({ count = 14 }: { count?: number }) {
  const words = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 12.9898 + n) * 43758.5453) % 1 + 1) % 1;
        return {
          text: PHRASES[(i * 5 + Math.floor(r(1) * 3)) % PHRASES.length]!,
          left: r(2) * 100,
          duration: 10 + r(3) * 12,
          delay: -r(4) * 12,
          size: 11 + r(5) * 9,
          drift: r(6) * 50 - 25,
          opacity: 0.22 + r(7) * 0.28,
        };
      }),
    [count],
  );

  return (
    <div className="word-rain" aria-hidden="true">
      {words.map((w, i) => (
        <span
          key={i}
          className="rain-word"
          style={{
            left: `${w.left}vw`,
            animationDuration: `${w.duration}s`,
            animationDelay: `${w.delay}s`,
            fontSize: `${w.size}px`,
            opacity: w.opacity,
            ["--drift" as string]: `${w.drift}px`,
          }}
        >
          {w.text}
        </span>
      ))}
    </div>
  );
}
