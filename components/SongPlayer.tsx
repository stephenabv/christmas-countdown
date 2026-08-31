"use client";

import { SONG_ARTIST, SONG_TITLE, SONG_VIDEO_ID } from "@/lib/song";

type Props = {
  playing: boolean;
  onPlay: () => void;
  /**
   * Only one embed may exist at a time or the song plays twice over itself.
   * The page keeps the single embed; the modal passes `embed={false}` and shows
   * a now-playing chip instead.
   */
  embed?: boolean;
};

/**
 * Browsers block autoplay with sound until the user has interacted with the
 * page, so playback is always reachable through an explicit button. Once the
 * page has been interacted with, the iframe mounts with autoplay and starts on
 * its own.
 */
export default function SongPlayer({ playing, onPlay, embed = true }: Props) {
  if (!playing) {
    return (
      <button type="button" className="btn btn-primary song-cta" onClick={onPlay}>
        <span className="song-cta-icon" aria-hidden="true">
          ▶
        </span>
        <span>
          Play &ldquo;{SONG_TITLE}&rdquo;
          <small>{SONG_ARTIST}</small>
        </span>
      </button>
    );
  }

  if (!embed) {
    return (
      <p className="now-playing" role="status">
        <span className="pulse" aria-hidden="true" />
        Now playing — {SONG_ARTIST}, &ldquo;{SONG_TITLE}&rdquo;
      </p>
    );
  }

  const src =
    `https://www.youtube-nocookie.com/embed/${SONG_VIDEO_ID}` +
    `?autoplay=1&rel=0&playsinline=1&modestbranding=1`;

  return (
    <div className="song-frame">
      <iframe
        src={src}
        title={`${SONG_ARTIST} - ${SONG_TITLE}`}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
