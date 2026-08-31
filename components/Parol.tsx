/** A parol — the five-pointed Philippine Christmas lantern. */
export default function Parol({ size = 120 }: { size?: number }) {
  return (
    <svg
      className="parol"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Parol, the Philippine Christmas lantern"
    >
      <defs>
        <radialGradient id="parolGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#ffe9a8" />
          <stop offset="55%" stopColor="#f7c948" />
          <stop offset="100%" stopColor="#e0343c" />
        </radialGradient>
      </defs>

      <g>
        <polygon
          points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38"
          fill="url(#parolGlow)"
          stroke="#ffd873"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon
          points="50,24 56,42 74,42 59,53 65,72 50,60 35,72 41,53 26,42 44,42"
          fill="none"
          stroke="#b3161f"
          strokeWidth="1.6"
          opacity="0.75"
        />
        {/* Streamers */}
        <path
          d="M28 90 q-4 12 -10 18 M36 92 q-2 13 -6 20 M64 92 q2 13 6 20 M72 90 q4 12 10 18"
          stroke="#2f9e5e"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
