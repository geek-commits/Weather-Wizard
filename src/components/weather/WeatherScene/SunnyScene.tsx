export function SunnyScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 50% 35%, #FFF1D6 0%, #FFE7B8 38%, #FFD59A 62%, #FFB870 88%)`,
        }}
      />
      {/* large sun - partially behind info layer — ambient float + glow */}
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
        {/* outer glow — breathing */}
        <div
          className="absolute rounded-full blur-[42px]"
          style={{
            width: 340,
            height: 340,
            left: -170,
            top: -170,
            background: "radial-gradient(circle, #FF8C2E 0%, #FFB86A 40%, transparent 72%)",
            animation: "ww-sun-glow 6s ease-in-out infinite alternate",
          }}
        />
        {/* sun body — slow float */}
        <div
          className="relative rounded-full"
          style={{
            width: 248,
            height: 248,
            marginLeft: -124,
            marginTop: -124,
            background: "radial-gradient(circle at 32% 30%, #FFF7CC 0%, #FFD07A 22%, #FF8C2E 58%, #F97316 78%)",
            boxShadow: "0 0 80px rgba(251,146,60,0.35), inset 0 1px 0 rgba(255,255,255,0.6)",
            animation: "ww-sun-float 8.5s ease-in-out infinite alternate",
          }}
        >
          {/* subtle highlight */}
          <div
            className="absolute rounded-full"
            style={{
              width: 88,
              height: 88,
              left: 38,
              top: 34,
              background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)",
              filter: "blur(6px)",
            }}
          />
        </div>
      </div>

      {/* soft atmospheric bottom fade into surface */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[44%]"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(255,247,237,0.55) 45%, #F3F4F8 92%)",
        }}
      />
    </div>
  );
}
