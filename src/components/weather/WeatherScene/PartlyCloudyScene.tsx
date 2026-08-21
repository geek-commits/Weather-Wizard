export function PartlyCloudyScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 42%, #FFF1DC 76%, #FFD8A8 100%)`,
        }}
      />
      {/* sun peek behind cloud - right side — opposite drift for parallax */}
      <div
        className="absolute left-[58%] top-[32%] -translate-x-1/2 -translate-y-1/2"
        style={{ animation: "ww-cloud-drift-reverse 11s ease-in-out infinite alternate" }}
      >
        <div
          className="absolute rounded-full blur-[36px] opacity-50"
          style={{
            width: 300,
            height: 300,
            left: -150,
            top: -150,
            background: "radial-gradient(circle, #FB923C 0%, transparent 68%)",
          }}
        />
        <div
          className="rounded-full"
          style={{
            width: 210,
            height: 210,
            marginLeft: -105,
            marginTop: -105,
            background: "radial-gradient(circle at 30% 28%, #FFF7CC 0%, #FFD07A 30%, #FB923C 65%)",
          }}
        />
      </div>

      {/* soft cloud composition - left/center — slow drift */}
      <svg
        viewBox="0 0 400 220"
        className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-[118%] h-[52%]"
        aria-hidden
        style={{ animation: "ww-cloud-drift-slow 12.5s ease-in-out infinite alternate" }}
      >
        <defs>
          <radialGradient id="pc-cloud" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="65%" stopColor="#EEF2FF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.45" />
          </radialGradient>
          <filter id="pc-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <g filter="url(#pc-blur)" opacity="0.95">
          <ellipse cx="140" cy="132" rx="92" ry="54" fill="url(#pc-cloud)" />
          <ellipse cx="210" cy="118" rx="118" ry="68" fill="url(#pc-cloud)" />
          <ellipse cx="285" cy="138" rx="78" ry="48" fill="url(#pc-cloud)" />
          <ellipse cx="175" cy="158" rx="110" ry="42" fill="url(#pc-cloud)" opacity="0.85" />
        </g>
        {/* second soft layer */}
        <g opacity="0.55">
          <ellipse cx="200" cy="118" rx="150" ry="22" fill="#FFFFFF" style={{ filter: "blur(18px)" }} />
        </g>
      </svg>

      <div
        className="absolute bottom-0 left-0 right-0 h-[46%]"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(243,244,248,0.65) 52%, #F3F4F8 90%)",
        }}
      />
    </div>
  );
}
