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
      {/* Premium staged entrance: temp scale, condition + meta cascade */}
      <style>{`
        @keyframes ww-tempIn { from { opacity:0; transform: scale(0.98) translateY(6px); } to { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes ww-lineIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
        @keyframes ww-iconIn { from { opacity:0; transform: scale(0.94); } to { opacity:1; transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .ww-info-temp, .ww-info-line, .ww-info-icon { animation: none !important; }
        }
      `}</style>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            key={`${temperature}-${unit}`}
            aria-label={`${formatTemp(temperature, unit)} ${description}`}
            className="ww-info-temp text-[64px] md:text-[68px] font-[520] tracking-[-0.06em] leading-[0.85] text-[#0F172A]"
            style={{
              fontVariantNumeric: "tabular-nums",
              animation: "ww-tempIn 380ms cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {formatTemp(temperature, unit)}
          </p>
          <p
            key={description}
            className="ww-info-line mt-2 text-[14px] font-[500] tracking-[-0.015em] text-[#0F172A] capitalize leading-none"
            style={{ animation: "ww-lineIn 260ms cubic-bezier(0.22,1,0.36,1) 60ms both" }}
          >
            {description}
          </p>
          {(humidity !== undefined || windSpeed !== undefined) && (
            <p
              className="ww-info-line mt-1.5 text-[12px] font-[450] text-[#94A3B8] tracking-[-0.01em] leading-none"
              style={{ animation: "ww-lineIn 260ms cubic-bezier(0.22,1,0.36,1) 120ms both" }}
            >
              {humidity !== undefined ? `Humidity ${humidity}%` : null}
              {humidity !== undefined && windSpeed !== undefined ? " · " : null}
              {windSpeed !== undefined ? `Wind ${Math.round(windSpeed)} ${windSpeed > 20 ? "km/h" : "m/s"}` : null}
            </p>
          )}
        </div>
        <div
          key={condition}
          className="ww-info-icon shrink-0 pt-1 pr-1"
          style={{ animation: "ww-iconIn 360ms cubic-bezier(0.4,0,0.2,1) 40ms both" }}
        >
          <WeatherIcon condition={condition} className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] text-[#0F172A]" />
        </div>
      </div>
    </div>
  );
}
