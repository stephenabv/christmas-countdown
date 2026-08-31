"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CelebrationModal from "./CelebrationModal";
import Parol from "./Parol";
import SongPlayer from "./SongPlayer";
import {
  formatTargetPHT,
  getRemaining,
  getSeasonState,
  type Remaining,
} from "@/lib/season";

type NotificationState = "unsupported" | "default" | "granted" | "denied";

const UNITS: Array<{ key: keyof Remaining; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

/**
 * Read-only test hooks, so the arrival moment can be rehearsed without waiting
 * for September:  ?in=10  aims the clock 10 seconds out,  ?demo=1  jumps
 * straight to the celebration.
 */
function readOverrides(): { target?: number; demo: boolean } {
  if (typeof window === "undefined") return { demo: false };
  const params = new URLSearchParams(window.location.search);
  const seconds = Number(params.get("in"));
  return {
    target: Number.isFinite(seconds) && seconds > 0
      ? Date.now() + seconds * 1000
      : undefined,
    demo: params.get("demo") === "1",
  };
}

export default function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  const [mounted, setMounted] = useState(false);
  const [overrideTarget, setOverrideTarget] = useState<number | undefined>();
  const [celebrating, setCelebrating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [permission, setPermission] = useState<NotificationState>("default");

  // Whether the user has interacted; browsers gate audible autoplay on this.
  const interacted = useRef(false);
  // Guards the one-time arrival effects.
  const fired = useRef(false);

  useEffect(() => {
    setMounted(true);

    const { target, demo } = readOverrides();
    if (target) setOverrideTarget(target);
    if (demo) {
      setCelebrating(true);
      setModalOpen(true);
      fired.current = true;
    }

    setPermission(
      typeof Notification === "undefined"
        ? "unsupported"
        : (Notification.permission as NotificationState)
    );

    const markInteracted = () => {
      interacted.current = true;
    };
    window.addEventListener("pointerdown", markInteracted, { once: true });
    window.addEventListener("keydown", markInteracted, { once: true });

    const tick = window.setInterval(() => setNow(Date.now()), 250);
    return () => {
      window.clearInterval(tick);
      window.removeEventListener("pointerdown", markInteracted);
      window.removeEventListener("keydown", markInteracted);
    };
  }, []);

  const season = getSeasonState(now);
  const target = overrideTarget ?? season.target;
  const remaining = getRemaining(target, now);
  const reached = celebrating || (overrideTarget
    ? remaining.total === 0
    : season.isSeasonOn);

  const notify = useCallback((seasonYear: number) => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;
    try {
      new Notification("Maligayang Pasko! 🎄", {
        body: `It's September 1, ${seasonYear} — Christmas season has officially started in the Philippines.`,
        icon: "/parol.svg",
        badge: "/parol.svg",
        tag: `ph-christmas-${seasonYear}`,
      });
    } catch {
      // Some browsers only allow notifications from a service worker; the
      // in-page modal already carries the message either way.
    }
  }, []);

  // The moment the clock hits zero, or a first visit already inside the season.
  useEffect(() => {
    if (!mounted || fired.current || !reached) return;
    fired.current = true;

    const seenKey = `ph-christmas-seen-${season.seasonYear}`;
    const alreadySeen =
      !overrideTarget && window.localStorage.getItem(seenKey) === "1";

    if (!alreadySeen) {
      setModalOpen(true);
      notify(season.seasonYear);
      // Sound is only allowed to start on its own once the page has been
      // interacted with; otherwise the modal's play button takes over.
      if (interacted.current) setPlaying(true);
      try {
        window.localStorage.setItem(seenKey, "1");
      } catch {
        // Private browsing — replaying the modal next visit is harmless.
      }
    }
    setCelebrating(true);
  }, [mounted, reached, season.seasonYear, overrideTarget, notify]);

  const requestPermission = async () => {
    interacted.current = true;
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result as NotificationState);
  };

  const startSong = () => {
    interacted.current = true;
    setPlaying(true);
  };

  // Christmas Day itself, for the second countdown once the season is open.
  const christmas = Date.UTC(season.seasonYear, 11, 25, -8, 0, 0);
  const toChristmas = getRemaining(christmas, now);

  // Server render always shows the pre-season layout; the clock swaps to the
  // celebration on mount, so markup stays deterministic through hydration.
  const showCelebration = mounted && reached;

  return (
    <>
      <header className="masthead">
        <p className="eyebrow">Philippines · Asia/Manila</p>
        <h1>
          The <span className="ber">-ber</span> months are{" "}
          {showCelebration ? "here" : "coming"}
        </h1>
      </header>

      {showCelebration ? (
        <section className="celebration">
          <h2 className="headline">
            Christmas season is <em>officially</em> open
          </h2>
          <p className="lede">
            September 1, {season.seasonYear} has passed in Manila. Welcome to the
            &ldquo;-ber months&rdquo;.
          </p>

          {toChristmas.total > 0 && (
            <>
              <p className="sub-countdown-label">
                Now counting down to Christmas Day
              </p>
              <div className="clock clock-sm">
                {UNITS.map((unit) => (
                  <div className="unit" key={unit.key}>
                    <span className="digits">
                      {String(toChristmas[unit.key]).padStart(2, "0")}
                    </span>
                    <span className="unit-label">{unit.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="actions">
            <SongPlayer playing={playing} onPlay={startSong} />
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setModalOpen(true)}
            >
              Show the announcement
            </button>
          </div>
        </section>
      ) : (
        <section className="counting">
          <p className="lede">
            September 1 marks the start of the longest Christmas season in the
            world.
          </p>
          <div className="clock">
            {UNITS.map((unit) => (
              <div className="unit" key={unit.key}>
                <span className="digits">
                  {mounted ? String(remaining[unit.key]).padStart(2, "0") : "--"}
                </span>
                <span className="unit-label">{unit.label}</span>
              </div>
            ))}
          </div>
          <p className="target-time">
            {mounted ? formatTargetPHT(target) : "\u00A0"}
          </p>

          {mounted && permission !== "unsupported" && (
            <div className="actions">
              {permission === "granted" ? (
                <p className="permission-note">
                  🔔 Notifications are on — you&rsquo;ll be told the moment it
                  hits.
                </p>
              ) : permission === "denied" ? (
                <p className="permission-note">
                  Notifications are blocked in your browser, but the announcement
                  will still pop up here.
                </p>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={requestPermission}
                >
                  🔔 Notify me when it starts
                </button>
              )}
            </div>
          )}
        </section>
      )}

      <div className="parol-row">
        <Parol size={showCelebration ? 132 : 96} />
      </div>

      {modalOpen && (
        <CelebrationModal
          seasonYear={season.seasonYear}
          playing={playing}
          onPlay={startSong}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
