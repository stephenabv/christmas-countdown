"use client";

import { useEffect, useRef } from "react";
import SongPlayer from "./SongPlayer";

type Props = {
  seasonYear: number;
  playing: boolean;
  onPlay: () => void;
  onClose: () => void;
};

export default function CelebrationModal({
  seasonYear,
  playing,
  onPlay,
  onClose,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebration-title"
      >
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 4.1) % 100}%`,
                animationDelay: `${(i % 8) * 0.18}s`,
                background: ["#e0343c", "#2f9e5e", "#f7c948", "#ffffff"][i % 4],
              }}
            />
          ))}
        </div>

        <p className="modal-kicker">Maligayang Pasko!</p>
        <h2 id="celebration-title">
          It&rsquo;s officially Christmas season in the Philippines
        </h2>
        <p className="modal-body">
          September 1, {seasonYear} has arrived. The longest Christmas season in
          the world starts now — the &ldquo;-ber months&rdquo; are here, the
          parols go up, and the countdown to December 25 begins.
        </p>

        <SongPlayer playing={playing} onPlay={onPlay} embed={false} />

        <button
          ref={closeRef}
          type="button"
          className="btn btn-ghost"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
