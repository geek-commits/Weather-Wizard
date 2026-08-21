import { useEffect, useRef, useState } from "react";
import type { ForecastDay, TemperatureUnit, WeatherCondition, WeatherStatus } from "../../types/weather";
import { WeatherHeader } from "./WeatherHeader";
import { WeatherScene } from "./WeatherScene";
import { WeatherInformation } from "./WeatherInformation";
import { ForecastSelector } from "./ForecastSelector";
import { useSound } from "../../hooks/useSound";

export function WeatherWidget({
  city,
  country,
  status,
  error,
  forecast,
  selectedIndex,
  unit,
  onSelectDay,
  onUnitChange,
  onRetry,
}: {
  city: string;
  country?: string;
  status: WeatherStatus;
  error: string | null;
  forecast: ForecastDay[];
  selectedIndex: number;
  unit: TemperatureUnit;
  onSelectDay: (i: number) => void;
  onUnitChange: (u: TemperatureUnit) => void;
  onRetry: () => void;
}) {
  const selected = forecast[selectedIndex] ?? forecast[0];

  // idle / loading skeletons preserve geometry
  const isLoading = status === "loading";
  const isError = status === "error";
  const isEmpty = forecast.length === 0 && !isLoading && !isError;

  const sceneCondition: WeatherCondition = selected?.condition ?? "sunny";
  const displayCity = city || "Weather";
  const displayCountry = country;
  const displayDate = selected?.date ?? new Date();
  const playRetry = useSound("pressSoft");

  // Day-aware scene transition metadata
  const sceneKey = selected ? `${selected.date.toISOString()}-${selected.condition}` : `empty-${selectedIndex}`;
  const [sceneDirection, setSceneDirection] = useState<1 | -1 | 0>(0);
  const prevIndexRef = useRef(selectedIndex);
  const isFirstSceneRef = useRef(true);
  useEffect(() => {
    if (isEmpty || isError) return;
    if (isFirstSceneRef.current) {
      isFirstSceneRef.current = false;
      prevIndexRef.current = selectedIndex;
      setSceneDirection(0);
      return;
    }
    if (selectedIndex > prevIndexRef.current) setSceneDirection(1);
    else if (selectedIndex < prevIndexRef.current) setSceneDirection(-1);
    else setSceneDirection(0);
    prevIndexRef.current = selectedIndex;
  }, [selectedIndex, isEmpty, isError]);

  return (
    <div
      role="region"
      aria-label="Weather widget"
      aria-live="polite"
      aria-busy={isLoading}
      className="relative w-[min(100%,380px)] overflow-hidden rounded-[30px] border border-[rgba(15,23,42,0.06)] bg-[#F3F4F8] shadow-[0_20px_60px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]"
      style={{ minHeight: 560 }}
    >
      {/* Scene layer - upper 62% — day-aware, direction-aware */}
      <div className="absolute inset-x-0 top-0 h-[62%]">
        {!isEmpty && !isError ? <WeatherScene condition={sceneCondition} sceneKey={sceneKey} direction={sceneDirection} /> : null}
        {/* empty/error fallback soft wash */}
        {(isEmpty || isError) && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#F1F5F9] via-[#EDEEF3] to-[#F3F4F8]" />
        )}
      </div>

      {/* Content */}
      <div className="relative flex min-h-[560px] flex-col">
        {/* Header always visible when has forecast */}
        {!isEmpty && !isError ? (
          <WeatherHeader city={displayCity} country={displayCountry} date={displayDate} unit={unit} onUnitChange={onUnitChange} />
        ) : (
          <div className="px-6 pt-6 md:px-7 md:pt-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[18px] font-[600] tracking-[-0.02em] text-[#0F172A]">Weather Wizard</p>
                <p className="mt-1 text-[13px] text-[#94A3B8]">Search for a city to see the weather</p>
              </div>
              <div className="opacity-60">
                {/* keep toggle visible even in empty but disabled look */}
                <div className="inline-flex rounded-full bg-[#EDEEF3] p-[2px]">
                  <span className="px-[10px] py-[4px] rounded-full bg-white text-[13px] font-[600] shadow-sm">°C</span>
                  <span className="px-[10px] py-[4px] rounded-full text-[13px] font-[600] text-[#94A3B8]">°F</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spacer to push info to middle */}
        <div className="flex-1 min-h-[200px]" />

        {/* Loading skeleton */}
        {isLoading && (
          <div className="relative z-10 px-6 md:px-7 pb-5 animate-pulse">
            <div className="h-[52px] w-[120px] rounded-[12px] bg-white/70" />
            <div className="mt-3 h-[14px] w-[90px] rounded-full bg-white/60" />
            <div className="mt-4 flex gap-2">
              <div className="h-[28px] w-[62px] rounded-full bg-white/80" />
              <div className="h-[28px] w-[62px] rounded-full bg-white/40" />
              <div className="h-[28px] w-[62px] rounded-full bg-white/30" />
            </div>
          </div>
        )}

        {isError && (
          <div className="relative z-10 px-6 md:px-7 pb-6 text-center">
            <p className="text-[15px] font-[600] tracking-[-0.02em] text-[#0F172A]">Weather unavailable</p>
            <p className="mt-1.5 text-[13px] leading-[1.5] text-[#64748B] max-w-[260px] mx-auto">{error}</p>
            <button
              onClick={() => {
                playRetry();
                onRetry();
              }}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#0F172A] px-5 py-[9px] text-[13px] font-[600] text-white shadow-sm hover:bg-[#1E293B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A] focus-visible:ring-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Success info */}
        {!isLoading && !isError && selected && (
          <div className="transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
            <WeatherInformation
              temperature={selected.temperature}
              condition={selected.condition}
              description={selected.description}
              unit={unit}
              humidity={selected.humidity}
              windSpeed={selected.windSpeed}
            />
            <ForecastSelector days={forecast} selectedIndex={selectedIndex} onSelect={onSelectDay} />
          </div>
        )}

        {/* Empty hint when no forecast yet but not loading/error — show selector placeholder? Already handled header */}
      </div>
    </div>
  );
}
