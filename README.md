# 🎄 Philippine Christmas Countdown

A countdown clock to **September 1** — the day the Christmas season officially
opens in the Philippines and the "-ber months" begin. When the clock hits zero
the site announces it with a modal, a browser notification, and Mariah Carey's
"All I Want for Christmas Is You".

## How it works

- **The clock** counts down to September 1, 00:00 **Philippine Standard Time**
  (UTC+8, no DST), regardless of where the visitor is.
- **At zero** the page swaps to a celebration view, opens the announcement
  modal, fires a browser notification (if permitted), and starts the song.
- **During the season** (September 1 through the Feast of the Three Kings on
  January 6) visitors land straight on the celebration view, which then counts
  down to Christmas Day. The modal shows once per season, remembered in
  `localStorage`.
- **After January 6** the clock rolls over to the following September 1.

### Notifications

Browsers only grant notification permission from a user gesture, so the
countdown view offers a "Notify me when it starts" button. If permission is
denied or unavailable, the in-page modal still delivers the announcement.

### The song

Browsers block autoplay with sound until the visitor has interacted with the
page. If they have (clicking anywhere counts), the song starts on its own at
zero. Otherwise the modal's play button starts it. Only one embed is ever
mounted, so the song never plays over itself.

## Configuration

Copy `.env.example` to `.env.local` and adjust as needed. Every variable is
optional.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CHRISTMAS_SONG_URL` | Mariah Carey — "All I Want for Christmas Is You" | The song played at zero. Accepts `watch?v=…`, `youtu.be/…`, `/embed/…`, or a bare video id. |
| `NEXT_PUBLIC_SEASON_START_MONTH` | `9` | Month the season opens. |
| `NEXT_PUBLIC_SEASON_START_DAY` | `1` | Day the season opens. |

On Vercel, set these under **Settings → Environment Variables**. `NEXT_PUBLIC_`
values are inlined at build time, so redeploy after changing one.

## Running locally

```bash
npm install
npm run dev     # http://localhost:3000
```

```bash
npm run build && npm run start   # production build
```

### Rehearsing the moment

Two query parameters make the arrival testable without waiting for September:

- `?in=10` — aim the clock 10 seconds out and watch the transition fire.
- `?demo=1` — jump straight to the celebration and the modal.

## Deployment

The project deploys to Vercel from the `main` branch: every push to `main`
ships to production, and pull requests get preview deployments. No build
configuration is needed — Vercel detects Next.js automatically.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · plain CSS, no UI dependencies.
