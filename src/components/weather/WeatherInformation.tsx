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
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            aria-label={`${formatTemp(temperature, unit)} ${description}`}
            className="text-[64px] md:text-[68px] font-[520] tracking-[-0.06em] leading-[0.85] text-[#0F172A]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formatTemp(temperature, unit)}
          </p>
          <p className="mt-2 text-[14px] font-[500] tracking-[-0.015em] text-[#0F172A] capitalize leading-none">
            {description}
          </p>
          {(humidity !== undefined || windSpeed !== undefined) && (
            <p className="mt-1.5 text-[12px] font-[450] text-[#94A3B8] tracking-[-0.01em] leading-none">
              {humidity !== undefined ? `Humidity ${humidity}%` : null}
              {humidity !== undefined && windSpeed !== undefined ? " · " : null}
              {windSpeed !== undefined ? `Wind ${Math.round(windSpeed)} ${windSpeed > 20 ? "km/h" : "m/s"}` : null}
            </p>
          )}
        </div>
        <div className="shrink-0 pt-1 pr-1">
          <WeatherIcon condition={condition} className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] text-[#0F172A]" />
        </div>
      </div>
    </div>
  );
}
