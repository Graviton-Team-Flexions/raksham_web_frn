// A drawn placeholder portrait (not a real person). `look` sets skin, hair, glasses, suit and so on.
function AdvocatePortrait({ look, label }) {
  const { skin, hair, style, suit, shirt, glasses, beard, female } = look
  const shade = 'rgb(0 0 0 / 0.12)'
  const hairPath = {
    bun: 'M68 62 q0 -36 32 -36 q32 0 32 36 q-12 -20 -32 -20 q-20 0 -32 20z',
    bob: 'M64 74 q-4 -52 36 -50 q40 -2 36 50 q-6 -30 -36 -30 q-30 0 -36 30z',
    long: 'M66 66 q0 -42 34 -42 q34 0 34 42 q-12 -24 -34 -24 q-22 0 -34 24z',
  }[style] ?? 'M70 56 q4 -32 30 -32 q26 0 30 32 q-14 -12 -30 -12 q-16 0 -30 12z'

  return (
    <svg className="adv-portrait" viewBox="0 0 200 160" role="img" aria-label={label} preserveAspectRatio="xMidYMax slice">
      <path d="M-20 160 A112 112 0 0 1 132 52 L132 160 Z" fill="#ffe9a6" />
      {style === 'long' && <path d="M66 62 q-6 56 6 70 h56 q12 -14 6 -70z" fill={hair} />}
      <path d={female ? 'M24 160 q4 -40 46 -50 h60 q42 10 46 50z' : 'M18 160 q4 -46 52 -54 h60 q48 8 52 54z'} fill={suit} />
      <rect x="88" y="92" width="24" height="24" rx="8" fill={skin} />
      <rect x="88" y="92" width="24" height="9" fill={shade} />
      <path d="M78 106 l22 30 l22 -30 l-10 -6 h-24z" fill={shirt} />
      <path d="M78 106 l-14 22 l22 8z M122 106 l14 22 l-22 8z" fill={suit} stroke="rgb(255 255 255 / 0.08)" />
      {!female && <path d="M96 118 l4 -4 l4 4 l-3 18 h-2z" fill="#8a1c1c" />}
      <ellipse cx="68" cy="68" rx="5" ry="8" fill={skin} />
      <ellipse cx="132" cy="68" rx="5" ry="8" fill={skin} />
      <ellipse cx="100" cy="66" rx="31" ry="38" fill={skin} />
      {beard && <path d="M70 72 q2 38 30 40 q28 -2 30 -40 q-8 22 -30 22 q-22 0 -30 -22z" fill={hair} opacity="0.88" />}
      <path d={hairPath} fill={hair} />
      {style === 'bun' && <circle cx="100" cy="22" r="11" fill={hair} />}
      <path d="M82 60 q6 -4 12 0 M106 60 q6 -4 12 0" stroke={hair} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <circle cx="88" cy="68" r="2.6" fill="#1b1b1b" />
      <circle cx="112" cy="68" r="2.6" fill="#1b1b1b" />
      <path d="M100 70 q-2 8 2 10" stroke={shade} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M90 86 q10 8 20 0" stroke="#7a3a30" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      {glasses && (
        <g fill="none" stroke="#1b1b1b" strokeWidth="2.2">
          <rect x="76" y="60" width="22" height="16" rx="6" />
          <rect x="102" y="60" width="22" height="16" rx="6" />
          <path d="M98 67 h4" />
        </g>
      )}
    </svg>
  )
}

export default AdvocatePortrait
