export function RainScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 32%, #BFDBFE 58%, #E0E7FF 78%, #F3F4F8 100%)`,
        }}
      />

      {/* cloud base — slow drift */}
      <svg viewBox="0 0 400 200" className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-[118%] h-[46%]" aria-hidden style={{ animation: "ww-cloud-drift-slow 12s ease-in-out infinite alternate" }}>
        <defs>
          <radialGradient id="r-cloud" cx="50%" cy="38%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>
          <filter id="r-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <g filter="url(#r-blur)">
          <ellipse cx="135" cy="96" rx="82" ry="48" fill="url(#r-cloud)" />
          <ellipse cx="208" cy="82" rx="112" ry="62" fill="url(#r-cloud)" />
          <ellipse cx="285" cy="96" rx="74" ry="44" fill="url(#r-cloud)" />
          <ellipse cx="200" cy="112" rx="128" ry="36" fill="url(#r-cloud)" opacity="0.85" />
        </g>
      </svg>

      {/* rain streaks — falling with wind */}
      <svg viewBox="0 0 400 260" className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[92%] h-[52%] opacity-[0.38] overflow-visible" aria-hidden>
        <g stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" style={{ animation: "ww-rain-fall-a 800ms linear infinite" }}>
          {/* multiple angled rain lines */}
          {[
            [48, 22, 42, 44],
            [78, 18, 72, 40],
            [108, 28, 102, 50],
            [138, 16, 132, 38],
            [168, 32, 162, 54],
            [198, 20, 192, 42],
            [228, 26, 222, 48],
            [258, 14, 252, 36],
            [288, 30, 282, 52],
            [318, 18, 312, 40],
            [63, 52, 57, 74],
            [93, 48, 87, 70],
            [123, 58, 117, 80],
            [153, 46, 147, 68],
            [183, 62, 177, 84],
            [213, 50, 207, 72],
            [243, 56, 237, 78],
            [273, 44, 267, 66],
            [303, 60, 297, 82],
          ].map(([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              style={{ filter: "blur(0.3px)" }}
            />
          ))}
        </g>
      </svg>

      {/* bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[42%]"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(219,234,254,0.35) 28%, #F3F4F8 85%)",
        }}
      />
    </div>
  );
}

export function StormScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, #E0E7FF 0%, #C7D2FE 34%, #A5B4FC 62%, #E0E7FF 82%, #F3F4F8 100%)`,
        }}
      />
      <svg viewBox="0 0 400 200" className="absolute bottom-[42%] left-1/2 -translate-x-1/2 w-[118%] h-[46%]" aria-hidden style={{ animation: "ww-cloud-drift-slow 10s ease-in-out infinite alternate" }}>
        <defs>
          <radialGradient id="s-cloud" cx="50%" cy="38%">
            <stop offset="0%" stopColor="#E0E7FF" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.85" />
          </radialGradient>
          <filter id="s-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5.5" />
          </filter>
        </defs>
        <g filter="url(#s-blur)">
          <ellipse cx="140" cy="98" rx="86" ry="50" fill="url(#s-cloud)" opacity="0.95" />
          <ellipse cx="215" cy="84" rx="116" ry="64" fill="#312E81" opacity="0.92" />
          <ellipse cx="292" cy="98" rx="78" ry="46" fill="url(#s-cloud)" />
        </g>
      </svg>
      {/* lightning — deterministic flash 6.5s */}
      <svg viewBox="0 0 400 260" className="absolute inset-0 w-full h-full" aria-hidden style={{ animation: "ww-lightning-flash 6.5s ease-in-out infinite" }}>
        <path d="M208 88 L195 122 L206 122 L192 158 L214 126 L202 126 Z" fill="#FACC15" style={{ filter: "blur(0.5px)" }} />
      </svg>
      <svg viewBox="0 0 400 260" className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[92%] h-[52%] opacity-[0.32] overflow-visible" aria-hidden>
        <g stroke="#4338CA" strokeWidth="1.4" strokeLinecap="round" style={{ animation: "ww-rain-fall-a 720ms linear infinite" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={55 + i * 28} y1={22 + (i % 3) * 6} x2={49 + i * 28} y2={44 + (i % 3) * 6} />
          ))}
        </g>
      </svg>
      <div
        className="absolute bottom-0 left-0 right-0 h-[44%]"
        style={{ background: "linear-gradient(to bottom, transparent, #F3F4F8 85%)" }}
      />
    </div>
  );
}
