import { useCallback, useEffect, useRef, useState } from "react";
import { BloomingRose } from "@/components/BloomingRose";
import { HeartCanvas } from "@/components/HeartCanvas";
import { WordRain } from "@/components/WordRain";

const songUrl = `${import.meta.env.BASE_URL}dandelions.mp3`;

type Stage = "closed" | "opening" | "open" | "heart" | "rose";

export function LoveExperience() {
  const [stage, setStage] = useState<Stage>("closed");
  const [muted, setMuted] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    [],
  );

  const openLetter = useCallback(() => {
    if (stage !== "closed") return;
    setStage("opening");
    timers.current.push(window.setTimeout(() => setStage("open"), 1500));
  }, [stage]);

  const startExperience = useCallback(() => {
    setStage("heart");
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.35;
      audio.loop = true;
      if (audio.paused) void audio.play().catch(() => {});
    }
    timers.current.push(window.setTimeout(() => setStage("rose"), 13000));
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const started = stage === "heart" || stage === "rose";

  return (
    <main className="love-stage" data-stage={stage}>
      <HeartCanvas active={started} />
      {started && <WordRain />}

      {stage === "rose" && (
        <div className="rose-holder">
          <BloomingRose key={runKey} embedded showMessage={false} />
        </div>
      )}

      {!started && (
        <div className="envelope-stage">
          <div className="envelope-wrap">
            <div className="envelope">
              <div className="envelope-flap" />
              <div className="envelope-body" />
            </div>
            <div className="letter">
              <div className="letter-inner">
                <div className="letter-seal">♥</div>
                <h1 className="letter-title">Bienvenida a mi mundo ❤️</h1>
                <p className="letter-text">
                  Quizás esto recién comienza, pero me alegra mucho que estés
                  aquí.
                </p>
                <button
                  type="button"
                  className="letter-cta"
                  onClick={startExperience}
                >
                  DESCUBRE LO QUE SIGUE →
                </button>
              </div>
            </div>
            {stage === "closed" && (
              <button type="button" className="open-button" onClick={openLetter}>
                ABRIR ❤️
              </button>
            )}
          </div>
        </div>
      )}

      {stage === "rose" && (
        <button
          type="button"
          className="replay-button"
          onClick={() => {
            setRunKey((k) => k + 1);
            setStage("heart");
            timers.current.push(
              window.setTimeout(() => setStage("rose"), 13000),
            );
          }}
        >
          Volver a verlo ♥
        </button>
      )}

      {started && (
        <button
          type="button"
          className="music-toggle"
          onClick={toggleMute}
          aria-label={muted ? "Activar música" : "Silenciar música"}
        >
          {muted ? "🔇" : "🎵"}
        </button>
      )}

      <audio ref={audioRef} loop preload="auto" src={songUrl} />
    </main>
  );
}
