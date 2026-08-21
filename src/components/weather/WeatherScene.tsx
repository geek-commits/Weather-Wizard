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
      {/* crossfade layers */}
      {(Object.keys(sceneMap) as WeatherCondition[]).map((key) => {
        const Component = sceneMap[key];
        const active = key === condition;
        return (
          <div
            key={key}
            aria-hidden={!active}
            className="absolute inset-0 transition-all duration-[520ms]"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "scale(1)" : "scale(1.02)",
              filter: active ? "blur(0px)" : "blur(4px)",
              pointerEvents: active ? "auto" : "none",
              transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            <Component />
          </div>
        );
      })}
    </div>
  );
}
