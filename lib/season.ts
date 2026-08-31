/**
 * Season math, all anchored to Philippine Standard Time (UTC+8, no DST).
 *
 * The "-ber months" tradition: Christmas season in the Philippines opens on
 * September 1 and runs through the Feast of the Three Kings in early January.
 */

export const PHT_OFFSET_HOURS = 8;

const SEASON_START_MONTH = Number(
  process.env.NEXT_PUBLIC_SEASON_START_MONTH ?? 9
);
const SEASON_START_DAY = Number(process.env.NEXT_PUBLIC_SEASON_START_DAY ?? 1);

/** Midnight PHT on a given calendar date, as a UTC timestamp. */
function phtMidnight(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day, 0 - PHT_OFFSET_HOURS, 0, 0, 0);
}

/** The calendar year in the Philippines at the given instant. */
function phtYear(now: number): number {
  return new Date(now + PHT_OFFSET_HOURS * 3600_000).getUTCFullYear();
}

/**
 * The Christmas season is over once the Feast of the Three Kings has passed
 * (January 6). Until then, a September start from the previous year still counts.
 */
function seasonEnd(startYear: number): number {
  return phtMidnight(startYear + 1, 1, 7);
}

export type SeasonState = {
  /** Timestamp (ms) of the September 1 the countdown is aimed at. */
  target: number;
  /** True when the season has already begun and has not yet ended. */
  isSeasonOn: boolean;
  /** The September 1 year the current season belongs to. */
  seasonYear: number;
};

export function getSeasonState(now: number = Date.now()): SeasonState {
  const year = phtYear(now);
  const thisYearStart = phtMidnight(year, SEASON_START_MONTH, SEASON_START_DAY);
  const lastYearStart = phtMidnight(
    year - 1,
    SEASON_START_MONTH,
    SEASON_START_DAY
  );

  // Still inside the season that opened last September (Jan 1 - Jan 6).
  if (now < thisYearStart && now < seasonEnd(year - 1)) {
    return { target: lastYearStart, isSeasonOn: true, seasonYear: year - 1 };
  }

  // Waiting for this year's September 1.
  if (now < thisYearStart) {
    return { target: thisYearStart, isSeasonOn: false, seasonYear: year };
  }

  // September 1 has arrived.
  if (now < seasonEnd(year)) {
    return { target: thisYearStart, isSeasonOn: true, seasonYear: year };
  }

  // Season is over; aim at next September.
  return {
    target: phtMidnight(year + 1, SEASON_START_MONTH, SEASON_START_DAY),
    isSeasonOn: false,
    seasonYear: year + 1,
  };
}

export type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

export function getRemaining(target: number, now: number): Remaining {
  const total = Math.max(0, target - now);
  const seconds = Math.floor(total / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    total,
  };
}

/** e.g. "September 1, 2026 at 12:00 AM PHT" */
export function formatTargetPHT(target: number): string {
  const formatted = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(target));
  return `${formatted} PHT`;
}
