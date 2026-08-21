import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ForecastDay } from "../../types/weather";
import { cn } from "../../lib/utils";
import { ForecastGlassThumb } from "./ForecastGlassThumb";

type ThumbGeometry = { x: number; width: number; height: number };

export function ForecastSelector({
  days,
  selectedIndex,
  onSelect,
}: {
  days: ForecastDay[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [thumb, setThumb] = useState<ThumbGeometry>({ x: 0, width: 0, height: 0 });
  const [hasMeasured, setHasMeasured] = useState(false);

  const measure = () => {
    const track = trackRef.current;
    const btn = tabRefs.current[selectedIndex];
    if (!track || !btn) return;
    // Use offsetLeft/Width because thumb lives in same positioned container
    const x = btn.offsetLeft;
    const width = btn.offsetWidth;
    const height = btn.offsetHeight;
    setThumb({ x, width, height });
    setHasMeasured(true);
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, days.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(track);
    // observe each tab as fallback
    tabRefs.current.forEach((el) => el && observer.observe(el));
    window.addEventListener("resize", measure);
    // fonts settle
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // scroll active into view when selection changes via user
    const btn = tabRefs.current[selectedIndex];
    if (!btn) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    btn.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [selectedIndex]);

  return (
    <div className="relative z-10 px-2 pb-3 md:px-3 md:pb-3.5">
      <div className="relative">
        <div
          ref={trackRef}
          role="tablist"
          aria-label="Forecast days"
          className="relative flex items-center gap-[2px] overflow-x-auto scrollbar-none py-1"
          style={{ scrollbarWidth: "none" }}
        >
          <ForecastGlassThumb x={thumb.x} width={thumb.width} height={thumb.height} hasMeasured={hasMeasured} />
          {days.map((d, i) => {
            const active = i === selectedIndex;
            return (
              <button
                key={`${d.date.toISOString()}-${i}`}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                aria-selected={active}
                onClick={() => onSelect(i)}
                className={cn(
                  "relative z-[2] shrink-0 px-[12px] py-[7px] rounded-full text-[12.5px] leading-none tracking-[-0.01em] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/20",
                  active ? "text-[#0F172A] font-[600]" : "text-[#8A94A8] font-[500] hover:text-[#475569]"
                )}
                style={{
                  transition: "color 190ms cubic-bezier(0.22,1,0.36,1), background-color 190ms ease",
                }}
              >
                {d.shortLabel}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
