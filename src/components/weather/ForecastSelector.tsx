import type { ForecastDay } from "../../types/weather";
import { cn } from "../../lib/utils";

export function ForecastSelector({
  days,
  selectedIndex,
  onSelect,
}: {
  days: ForecastDay[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="relative z-10 px-2 pb-3 md:px-3 md:pb-3.5">
      <style>{`
        @keyframes ww-pillIn { from { opacity:0; transform: translateY(4px) scale(0.98); } to { opacity:1; transform: translateY(0) scale(1); } }
        @media (prefers-reduced-motion: reduce) { .ww-pill { animation: none !important; } }
      `}</style>
      <div
        role="tablist"
        aria-label="Forecast days"
        className="flex items-center gap-[2px] overflow-x-auto scrollbar-none py-1"
        style={{ scrollbarWidth: "none" }}
      >
        {days.map((d, i) => {
          const active = i === selectedIndex;
          return (
            <button
              key={`${d.date.toISOString()}-${i}`}
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(i)}
              className={cn(
                "shrink-0 px-[12px] py-[7px] rounded-full text-[12.5px] font-[500] leading-none tracking-[-0.01em] transition-all whitespace-nowrap",
                active
                  ? "bg-white text-[#0F172A] shadow-[0_1px_8px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.06)]"
                  : "bg-transparent text-[#8A94A8] hover:text-[#475569] hover:bg-white/45"
              )}
              style={{
                transitionDuration: "200ms",
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
                transitionDelay: `${i * 18}ms`,
                animation: "ww-pillIn 320ms cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: `${i * 22}ms`,
              }}
            >
              {d.shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
