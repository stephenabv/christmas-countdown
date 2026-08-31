/**
 * Mariah Carey - "All I Want for Christmas Is You" (official video).
 * Overridable through NEXT_PUBLIC_CHRISTMAS_SONG_URL.
 */
const DEFAULT_VIDEO_ID = "aAkMkVFwAoo";

/** Pull the video id out of any common YouTube URL shape. */
export function parseYouTubeId(input: string | undefined): string {
  if (!input) return DEFAULT_VIDEO_ID;

  const raw = input.trim();
  if (!raw) return DEFAULT_VIDEO_ID;

  // A bare video id was supplied.
  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const fromQuery = url.searchParams.get("v");
    if (fromQuery && /^[\w-]{11}$/.test(fromQuery)) return fromQuery;

    // youtu.be/<id>, /embed/<id>, /shorts/<id>, /live/<id>
    const segments = url.pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    if (last && /^[\w-]{11}$/.test(last)) return last;
  } catch {
    // Not a URL — fall through to the default.
  }

  return DEFAULT_VIDEO_ID;
}

export const SONG_VIDEO_ID = parseYouTubeId(
  process.env.NEXT_PUBLIC_CHRISTMAS_SONG_URL
);

export const SONG_TITLE = "All I Want for Christmas Is You";
export const SONG_ARTIST = "Mariah Carey";
