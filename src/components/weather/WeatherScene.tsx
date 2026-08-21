import type { WeatherCondition } from "../../types/weather";
import { SunnyScene } from "./WeatherScene/SunnyScene";
import { PartlyCloudyScene } from "./WeatherScene/PartlyCloudyScene";
import { CloudyScene } from "./WeatherScene/CloudyScene";
import { RainScene, StormScene } from "./WeatherScene/RainScene";
import { SnowScene, FogScene } from "./WeatherScene/SnowScene";

const sceneMap: Record<WeatherCondition, React.ComponentType> = {
  sunny: SunnyScene,
  "partly-cloudy": PartlyCloudyScene,
  cloudy: CloudyScene,
  rain: RainScene,
  storm: StormScene,
  snow: SnowScene,
  fog: FogScene,
};

export function WeatherScene({ condition }: { condition: WeatherCondition }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-t-[30px]">
      {/* Premium triple-layer: Primary scale+opacity 520ms signature, Secondary blur 420ms, Ambient glow */}
      {(Object.keys(sceneMap) as WeatherCondition[]).map((key) => {
        const Component = sceneMap[key];
        const active = key === condition;
        return (
          <div
            key={key}
            aria-hidden={!active}
            className="absolute inset-0"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "scale(1) translateY(0)" : "scale(1.02) translateY(2px)",
              filter: active ? "blur(0px)" : "blur(6px)",
              pointerEvents: active ? "auto" : "none",
              transitionProperty: "opacity, transform, filter",
              transitionDuration: active ? "520ms, 520ms, 420ms" : "420ms, 420ms, 320ms",
              transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1), cubic-bezier(0.4,0,0.2,1), ease-out",
              willChange: "opacity, transform, filter",
            }}
          >
            <Component />
          </div>
        );
      })}
    </div>
  );
}
