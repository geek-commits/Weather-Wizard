import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog } from "lucide-react";
import type { WeatherCondition } from "../../types/weather";

const iconMap: Record<WeatherCondition, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  sunny: Sun,
  "partly-cloudy": CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
  storm: CloudLightning,
  snow: Snowflake,
  fog: CloudFog,
};

export function WeatherIcon({ condition, className }: { condition: WeatherCondition; className?: string }) {
  const Icon = iconMap[condition] ?? Sun;
  return <Icon className={className ?? "w-[28px] h-[28px] text-[#0F172A]"} strokeWidth={1.6} aria-hidden />;
}
