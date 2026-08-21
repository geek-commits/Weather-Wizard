import type { WeatherCondition, TemperatureUnit } from "../../types/weather";
import { formatTemp } from "../../lib/unit";
import { WeatherIcon } from "./WeatherIcon";

export function WeatherInformation({
  temperature,
  condition,
  description,
  unit,
  humidity,
  windSpeed,
}: {
  temperature: number;
  condition: WeatherCondition;
  description: string;
  unit: TemperatureUnit;
  humidity?: number;
  windSpeed?: number;
}) {
  return (
    <div className="relative z-10 px-6 md:px-7 pb-5">
      <style>{`
        .ww-info-temp, .ww-info-line, .ww-info-icon { transition: opacity 260ms cubic-bezier(0.22,1,0.36,1), transform 260ms cubic-bezier(0.22,1,0.36,1); }
        @starting-style { .ww-info-temp { opacity: 0; transform: scale(0.98) translateY(6px); } .ww-info-line { opacity: 0; transform: translateY(8px); } .ww-info-icon { opacity: 0; transform: scale(0.94); } }
        @media (prefers-reduced-motion: reduce) { .ww-info-temp, .ww-info-line, .ww-info-icon { transition: none !important; } }
      `}</style>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            aria-label={`${formatTemp(temperature, unit)} ${description}`}
            className="ww-info-temp text-[64px] md:text-[68px] font-[520] tracking-[-0.06em] leading-[0.85] text-[#0F172A]"
            style={{ fontVariantNumeric: "tabular-nums", transitionDelay: "0ms" }}
          >
            {formatTemp(temperature, unit)}
          </p>
          <p
            className="ww-info-line mt-2 text-[14px] font-[500] tracking-[-0.015em] text-[#0F172A] capitalize leading-none"
            style={{ transitionDelay: "60ms" }}
          >
            {description}
          </p>
          {(humidity !== undefined || windSpeed !== undefined) && (
            <p
              className="ww-info-line mt-1.5 text-[12px] font-[450] text-[#475569] tracking-[-0.01em] leading-none"
              style={{ transitionDelay: "120ms" }}
            >
              {humidity !== undefined ? `Humidity ${humidity}%` : null}
              {humidity !== undefined && windSpeed !== undefined ? " · " : null}
              {windSpeed !== undefined ? `Wind ${Math.round(windSpeed)} ${windSpeed > 20 ? "km/h" : "m/s"}` : null}
            </p>
          )}
        </div>
        <div className="ww-info-icon shrink-0 pt-1 pr-1" style={{ transitionDelay: "40ms" }}>
          <WeatherIcon condition={condition} className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] text-[#0F172A]" />
        </div>
      </div>
    </div>
  );
}
