import { useId, useMemo } from "react";

type ForecastGlassThumbProps = {
  x: number;
  width: number;
  height: number;
  radius?: number;
  disabled?: boolean;
  hasMeasured?: boolean;
};

export function ForecastGlassThumb({ x, width, height, radius = 9999, disabled, hasMeasured = true }: ForecastGlassThumbProps) {
  const id = useId();
  const filterId = `ww-forecast-glass-${id.replace(/:/g, "")}`;

  // Lightweight inline SVG displacement map — memoized, only regenerates when geometry changes
  const filterSvg = useMemo(() => {
    if (disabled || width === 0 || height === 0) return null;
    // Normalized displacement map: turbulence + displacement scale -22
    return (
      <svg width={0} height={0} aria-hidden style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId} x="-18%" y="-18%" width="136%" height="136%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves={2} seed={2} result="noise" />
            <feGaussianBlur in="noise" stdDeviation="0.8" result="softNoise" />
            <feDisplacementMap in="SourceGraphic" in2="softNoise" scale={-22} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    );
  }, [filterId, width, height, disabled]);

  if (disabled || width === 0 || height === 0) return null;

  return (
    <>
      {filterSvg}
      <style>{`@supports (backdrop-filter: url(#x)) or (-webkit-backdrop-filter: url(#x)) { .ww-glass-fallback{display:none !important} .ww-glass-enhanced{display:block !important} }`}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -translate-y-1/2"
        style={{
          left: 0,
          width,
          height,
          borderRadius: radius,
          transform: `translate3d(${x}px, -50%, 0)`,
          opacity: hasMeasured ? 1 : 0,
          visibility: hasMeasured ? "visible" : "hidden",
          // Layer 2 tint + Layer 3 specular + outer elevation — locked: 0.48, blur 11px, radius 9999
          background: "rgba(255,255,255,0.48)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.90), inset 0 -1px 0 rgba(255,255,255,0.28), inset 1px 0 0 rgba(255,255,255,0.30), inset -1px 0 0 rgba(255,255,255,0.30), 0 8px 24px rgba(15,23,42,0.08), 0 2px 8px rgba(15,23,42,0.06)",
          border: "1px solid rgba(255,255,255,0.65)",
          willChange: "transform, width",
          transition: hasMeasured
            ? "transform 460ms cubic-bezier(0.22,1,0.36,1), width 420ms cubic-bezier(0.22,1,0.36,1), opacity 150ms ease-out"
            : undefined,
        }}
      >
        {/* Refraction / blur layer — Chromium enhanced + fallback */}
        <div
          className="ww-glass-fallback absolute inset-0"
          style={{
            borderRadius: radius,
            backdropFilter: `blur(11px) brightness(1.04) saturate(1.10)`,
            WebkitBackdropFilter: `blur(11px) brightness(1.04) saturate(1.10)`,
          }}
        />
        {/* Chromium refraction enhancement */}
        <div
          className="ww-glass-enhanced absolute inset-0 hidden"
          style={{
            borderRadius: radius,
            backdropFilter: `blur(11px) url(#${filterId}) brightness(1.04) saturate(1.15)`,
            WebkitBackdropFilter: `blur(11px) url(#${filterId}) brightness(1.04) saturate(1.15)`,
          }}
          aria-hidden
        />
      </div>
    </>
  );
}
