// Vector illustrations for the Resources page. Used where the design shows photos or a book;
// swap in real photos later by adding an `image` field to an article in data/resourceHub.js.
const INK = '#1b1b1b'
const YELLOW = '#ffc400'

export function BookArt() {
  return (
    <svg viewBox="0 0 180 170" aria-hidden="true" focusable="false">
      <g stroke={YELLOW} strokeWidth="5" strokeLinecap="round">
        <path d="M38 22 L30 8" />
        <path d="M62 14 L62 0" />
        <path d="M18 44 L2 38" />
      </g>
      <g transform="rotate(-8 95 95)">
        <rect x="46" y="30" width="104" height="124" rx="10" fill="#e0a800" stroke={INK} strokeWidth="5" />
        <rect x="40" y="24" width="104" height="124" rx="10" fill={YELLOW} stroke={INK} strokeWidth="5" />
        <path d="M54 30 V148" stroke={INK} strokeWidth="4" />
        <path
          d="M98 52 L124 62 V86 C124 102 113 112 98 118 C83 112 72 102 72 86 V62 Z"
          fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round"
        />
        <path d="M98 70 L103 81 L115 82 L106 90 L109 102 L98 96 L87 102 L90 90 L81 82 L93 81 Z" fill={YELLOW} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

// One illustration per article card; 16:9 so every card image has the same shape.
const SCENES = {
  scam: (
    <>
      <rect width="320" height="180" fill="#27303a" />
      <circle cx="60" cy="150" r="70" fill="#34404c" />
      <rect x="112" y="14" width="96" height="168" rx="16" fill="#0f1317" stroke="#6b7783" strokeWidth="3" />
      <rect x="120" y="26" width="80" height="144" rx="8" fill="#1d252d" />
      <path d="M160 52 L190 106 H130 Z" fill="#e5322d" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
      <rect x="157" y="68" width="6" height="20" rx="3" fill="#fff" />
      <circle cx="160" cy="96" r="4" fill="#fff" />
      <text x="160" y="132" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" fontFamily="sans-serif">SCAM</text>
      <path d="M218 150 C240 120 262 128 276 150 L276 182 L212 182 Z" fill="#c68b64" />
    </>
  ),
  gavel: (
    <>
      <rect width="320" height="180" fill="#9a6a3c" />
      <rect y="120" width="320" height="60" fill="#7c4f27" />
      <ellipse cx="160" cy="146" rx="78" ry="16" fill="#4a2b12" />
      <rect x="116" y="124" width="88" height="22" rx="5" fill="#2e1a0a" />
      <g transform="rotate(-24 160 70)">
        <rect x="96" y="40" width="108" height="42" rx="9" fill="#3b2410" />
        <rect x="88" y="44" width="14" height="34" rx="5" fill="#c9a24a" />
        <rect x="198" y="44" width="14" height="34" rx="5" fill="#c9a24a" />
        <rect x="150" y="80" width="12" height="80" rx="5" fill="#3b2410" transform="rotate(48 156 80)" />
      </g>
    </>
  ),
  laptop: (
    <>
      <rect width="320" height="180" fill="#415a77" />
      <rect y="132" width="320" height="48" fill="#2f4259" />
      <rect x="82" y="26" width="156" height="102" rx="8" fill="#12202f" stroke="#aab7c4" strokeWidth="4" />
      <rect x="90" y="34" width="140" height="86" rx="4" fill="#1d3a5b" />
      <rect x="140" y="64" width="40" height="34" rx="6" fill="#fff" />
      <path d="M148 64 V54 A12 12 0 0 1 172 54 V64" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <circle cx="160" cy="80" r="5" fill="#1d3a5b" />
      <path d="M60 132 H260 L246 146 H74 Z" fill="#c4ccd4" />
    </>
  ),
}

export function ArticleArt({ name }) {
  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {SCENES[name]}
    </svg>
  )
}
