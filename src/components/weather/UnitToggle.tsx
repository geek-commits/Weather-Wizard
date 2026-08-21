import type { TemperatureUnit } from "../../types/weather";
import { cn } from "../../lib/utils";

export function UnitToggle({
  unit,
  onChange,
}: {
  unit: TemperatureUnit;
  onChange: (u: TemperatureUnit) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Temperature unit"
      className="inline-flex items-center rounded-full bg-[#EDEEF3] p-[2px] gap-[1px]"
    >
      {(["fahrenheit", "celsius"] as const).map((u) => {
        const active = unit === u;
        const label = u === "fahrenheit" ? "°F" : "°C";
        return (
          <button
            key={u}
            type="button"
            aria-pressed={active}
            aria-label={`Switch to ${label}`}
            onClick={() => onChange(u)}
            className={cn(
              "min-w-[36px] px-[10px] py-[4px] rounded-full text-[13px] font-[600] leading-none tracking-tight transition-all duration-200",
              active
                ? "bg-white text-[#0F172A] shadow-[0_1px_6px_rgba(15,23,42,0.10),0_1px_2px_rgba(15,23,42,0.08)]"
                : "bg-transparent text-[#94A3B8] hover:text-[#64748B]"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
