export function CloudyScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 38%, #E8EEF6 72%, #F3F4F8 100%)`,
        }}
      />
      {/* subtle top glow — slow reverse */}
      <div
        className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[86%] h-[56%] rounded-[40px] blur-[32px] opacity-30"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, transparent 70%)",
          animation: "ww-cloud-drift-reverse 17s ease-in-out infinite alternate",
        }}
      />

      <svg
        viewBox="0 0 400 240"
        className="absolute bottom-[26%] left-1/2 -translate-x-1/2 w-[124%] h-[58%]"
        aria-hidden
        style={{ animation: "ww-cloud-drift-slow 14s ease-in-out infinite alternate" }}
      >
        <defs>
          <radialGradient id="c-cloud1" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </radialGradient>
          <radialGradient id="c-cloud2" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>
          <filter id="c-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5.5" />
          </filter>
        </defs>
        <g filter="url(#c-blur)">
          <ellipse cx="118" cy="132" rx="96" ry="56" fill="url(#c-cloud1)" opacity="0.98" />
          <ellipse cx="202" cy="112" rx="132" ry="72" fill="url(#c-cloud1)" />
          <ellipse cx="298" cy="132" rx="88" ry="52" fill="url(#c-cloud2)" opacity="0.92" />
          <ellipse cx="168" cy="158" rx="124" ry="44" fill="url(#c-cloud2)" opacity="0.88" />
          <ellipse cx="250" cy="162" rx="84" ry="38" fill="url(#c-cloud1)" opacity="0.7" />
        </g>
        <g opacity="0.35">
          <ellipse cx="200" cy="108" rx="160" ry="18" fill="#FFFFFF" style={{ filter: "blur(16px)" }} />
        </g>
      </svg>

      <div
        className="absolute bottom-0 left-0 right-0 h-[46%]"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(241,245,249,0.5) 40%, #F3F4F8 88%)",
        }}
      />
    </div>
  );
}
