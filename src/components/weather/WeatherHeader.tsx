import { formatCityHeaderDate, formatHeaderDate } from "../../lib/weatherMapping";
import type { TemperatureUnit } from "../../types/weather";
import { UnitToggle } from "./UnitToggle";

function isCityUTCDate(d: Date): boolean {
  // Real forecast dates are created as Date.UTC(..,12) so UTC noon
  return d.getUTCHours() === 12 && d.getUTCDate() !== 0;
}

export function WeatherHeader({
  city,
  country,
  date,
  unit,
  onUnitChange,
}: {
  city: string;
  country?: string;
  date: Date;
  unit: TemperatureUnit;
  onUnitChange: (u: TemperatureUnit) => void;
}) {
  return (
    <div className="relative z-10 flex items-start justify-between gap-4 px-6 pt-6 md:px-7 md:pt-7">
      <div className="min-w-0">
        <h2 className="text-[18px] font-[600] tracking-[-0.02em] text-[#0F172A] leading-none truncate">
          {city}
          {country ? <span className="font-[400] text-[#94A3B8]">, {country}</span> : null}
        </h2>
        <p className="mt-[6px] text-[13px] font-[450] tracking-[-0.01em] text-[#94A3B8] leading-none">
          {isCityUTCDate(date) ? formatCityHeaderDate(date) : formatHeaderDate(date)}
        </p>
      </div>
      <UnitToggle unit={unit} onChange={onUnitChange} />
    </div>
  );
}
