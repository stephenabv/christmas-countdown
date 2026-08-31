"use client";

import { useEffect, useState } from "react";

type Flake = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
};

/** Purely decorative; generated on the client so SSR output stays stable. */
export default function Snowfall({ count = 60 }: { count?: number }) {
  const [flakes, setFlakes] = useState<Flake[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    setFlakes(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 5,
        duration: 8 + Math.random() * 14,
        delay: -Math.random() * 20,
        drift: -60 + Math.random() * 120,
        opacity: 0.25 + Math.random() * 0.55,
      }))
    );
  }, [count]);

  return (
    <div className="snowfall" aria-hidden="true">
      {flakes.map((flake, i) => (
        <span
          key={i}
          className="flake"
          style={
            {
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              opacity: flake.opacity,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
              "--drift": `${flake.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
