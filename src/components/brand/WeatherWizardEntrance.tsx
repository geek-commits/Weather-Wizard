import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type Props = {
  /** max width in px, default 420 */
  maxWidth?: number;
  /** show the diagonal sweep pass — default true */
  showSweep?: boolean;
  /** replay mode: once per session (default) vs always */
  mode?: "sessionOnce" | "always";
  className?: string;
};

export function WeatherWizardEntrance({ maxWidth = 420, showSweep = true, mode = "sessionOnce", className }: Props) {
  const reduced = useReducedMotion();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShouldAnimate(false);
      return;
    }
    if (mode === "always") {
      setShouldAnimate(true);
      return;
    }
    try {
      const seen = sessionStorage.getItem("ww:entrance-seen");
      if (seen) {
        setShouldAnimate(false);
      } else {
        setShouldAnimate(true);
        sessionStorage.setItem("ww:entrance-seen", "1");
      }
    } catch {
      setShouldAnimate(true);
    }
  }, [reduced, mode]);

  const animate = shouldAnimate && !reduced;

  return (
    <div
      className={className}
      style={{ width: `min(100%, ${maxWidth}px)` }}
      aria-label="Weather Wizard"
      role="img"
    >
      <svg
        viewBox="0 0 500 100"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Weather Wizard"
        className="w-full h-auto block"
      >
        <style>{`
          .ww-icon-swoosh { opacity: 0.6; stroke-dashoffset: 0; }
          .ww-icon-wave { stroke-dashoffset: 0; }
          .ww-wordmark { opacity: 1; transform: translateX(0) scale(1); transform-origin: 112px 58px; }
          .ww-sweep { opacity: 0; }
          @keyframes ww-waveDraw {
            0%, 16.7% { stroke-dashoffset: 100; }
            55.6% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes ww-swooshDraw {
            0%, 27.8% { stroke-dashoffset: 100; opacity: 0; }
            55.6% { stroke-dashoffset: 0; opacity: 0.6; }
            100% { stroke-dashoffset: 0; opacity: 0.6; }
          }
          @keyframes ww-drift {
            0%, 55.6% { transform: translateY(0); }
            70% { transform: translateY(-1px); }
            83.3%, 100% { transform: translateY(0); }
          }
          @keyframes ww-wordmark {
            0%, 38.9% { opacity: 0; transform: translateX(-8px) scale(0.99); }
            72.2% { opacity: 1; transform: translateX(0) scale(1); }
            100% { opacity: 1; transform: translateX(0) scale(1); }
          }
          @keyframes ww-sweep {
            0%, 66.7% { transform: translateX(0); opacity: 0; }
            70% { opacity: 0.9; }
            80% { opacity: 0.9; }
            83.3% { transform: translateX(660px); opacity: 0; }
            100% { transform: translateX(660px); opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .ww-icon-wave, .ww-icon-swoosh, .ww-wordmark, .ww-sweep { animation: none !important; }
          }
        `}</style>

        <defs>
          <linearGradient id="ww-sweepGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7fe3ef" stopOpacity="0" />
            <stop offset="50%" stopColor="#bff2f8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#7fe3ef" stopOpacity="0" />
          </linearGradient>
          <mask id="ww-logoMask">
            <g transform="translate(6,6) scale(0.88)">
              <path d="M 15 40 C 25 34, 35 34, 42 40" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 22 32 C 28 55, 32 68, 38 68 C 44 68, 44 50, 50 50 C 56 50, 56 68, 62 68 C 68 68, 72 55, 78 32" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text
              x="112"
              y="58"
              fontSize="29"
              letterSpacing="1.2"
              fill="#ffffff"
              style={{ fontFamily: "'Inter',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif", fontWeight: 600 }}
            >
              WEATHER WIZARD
            </text>
          </mask>
        </defs>

        <g transform="translate(6,6) scale(0.88)">
          <path
            className="ww-icon-swoosh"
            d="M 15 40 C 25 34, 35 34, 42 40"
            fill="none"
            stroke="#0891A8"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={100}
            style={
              animate
                ? { animation: "ww-swooshDraw 1.8s cubic-bezier(0.22,1,0.36,1) 1 forwards, ww-drift 1.8s ease-in-out 1 forwards" }
                : undefined
            }
          />
          <path
            className="ww-icon-wave"
            d="M 22 32 C 28 55, 32 68, 38 68 C 44 68, 44 50, 50 50 C 56 50, 56 68, 62 68 C 68 68, 72 55, 78 32"
            fill="none"
            stroke="#0B1220"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray={100}
            style={animate ? { animation: "ww-waveDraw 1.8s cubic-bezier(0.22,1,0.36,1) 1 forwards" } : undefined}
          />
        </g>

        <text
          className="ww-wordmark"
          x="112"
          y="58"
          fontSize="29"
          letterSpacing="1.2"
          fill="#0B1220"
          style={
            animate ? { animation: "ww-wordmark 1.8s cubic-bezier(0.22,1,0.36,1) 1 forwards" } : undefined
          }
        >
          WEATHER WIZARD
        </text>

        {showSweep && (
          <g className="ww-sweep" mask="url(#ww-logoMask)" style={animate ? { animation: "ww-sweep 1.8s ease-in-out 1 forwards" } : undefined}>
            <rect x="-80" y="0" width="80" height="100" fill="url(#ww-sweepGradient)" />
          </g>
        )}
      </svg>
    </div>
  );
}
