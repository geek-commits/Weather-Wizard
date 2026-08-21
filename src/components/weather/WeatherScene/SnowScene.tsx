export function SnowScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 36%, #E2E8F0 68%, #F3F4F8 100%)`,
        }}
      />
      <svg viewBox="0 0 400 200" className="absolute bottom-[38%] left-1/2 -translate-x-1/2 w-[116%] h-[44%]" aria-hidden>
        <defs>
          <filter id="sn-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <g filter="url(#sn-blur)">
          <ellipse cx="145" cy="96" rx="82" ry="48" fill="#FFFFFF" opacity="0.96" />
          <ellipse cx="215" cy="82" rx="110" ry="60" fill="#FFFFFF" />
          <ellipse cx="285" cy="96" rx="74" ry="44" fill="#F8FAFC" />
        </g>
      </svg>
      {/* snow dots */}
      <svg viewBox="0 0 400 260" className="absolute inset-0 w-full h-full opacity-60" aria-hidden>
        <g fill="#CBD5E1">
          {[
            [70, 44, 2.2],
            [110, 68, 1.6],
            [150, 52, 2],
            [190, 78, 1.8],
            [230, 46, 2.1],
            [270, 70, 1.5],
            [310, 50, 1.9],
            [85, 92, 1.4],
            [135, 88, 2],
            [205, 102, 1.7],
            [255, 90, 1.6],
            [295, 98, 1.8],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} opacity="0.9" />
          ))}
        </g>
      </svg>
      <div
        className="absolute bottom-0 left-0 right-0 h-[44%]"
        style={{ background: "linear-gradient(to bottom, transparent, #F3F4F8 88%)" }}
      />
    </div>
  );
}

export function FogScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, #F1F5F9 0%, #E8EEF6 42%, #E2E8F0 72%, #F3F4F8 100%)`,
        }}
      />
      {/* layered fog bands */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 w-[92%] space-y-3">
        <div className="h-[22px] rounded-full bg-white/70 blur-[6px]" />
        <div className="h-[18px] rounded-full bg-white/55 blur-[8px] w-[92%] mx-auto" />
        <div className="h-[14px] rounded-full bg-white/40 blur-[10px] w-[84%] mx-auto" />
        <div className="h-[20px] rounded-full bg-[#E2E8F0]/60 blur-[7px] w-[88%] mx-auto" />
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-[48%]"
        style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(243,244,248,0.6) 50%, #F3F4F8 92%)" }}
      />
    </div>
  );
}
