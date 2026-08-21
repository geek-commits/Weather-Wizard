import { useEffect, useRef, useState } from "react";
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

type SceneSnapshot = { key: string; condition: WeatherCondition };

export function WeatherScene({
  condition,
  sceneKey,
  direction = 0,
}: {
  condition: WeatherCondition;
  sceneKey: string;
  direction?: 1 | -1 | 0;
}) {
  const [current, setCurrent] = useState<SceneSnapshot>({ key: sceneKey, condition });
  const [outgoing, setOutgoing] = useState<SceneSnapshot | null>(null);
  const [activeDirection, setActiveDirection] = useState<1 | -1 | 0>(0);
  const [isInitial, setIsInitial] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isInitial) {
      setCurrent({ key: sceneKey, condition });
      setIsInitial(false);
      return;
    }
    if (sceneKey === current.key) {
      if (condition !== current.condition) {
        setOutgoing(current);
        setCurrent({ key: sceneKey, condition });
        setActiveDirection(direction);
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setOutgoing(null), 560);
      }
      return;
    }
    // Day change — max 2 layers, rapid discards older outgoing
    setOutgoing(current);
    setCurrent({ key: sceneKey, condition });
    setActiveDirection(direction);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setOutgoing(null), 560);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneKey]);

  useEffect(() => {
    if (!isInitial && sceneKey === current.key && condition !== current.condition) {
      setCurrent({ key: sceneKey, condition });
    }
  }, [condition, sceneKey, current.key, current.condition, isInitial]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const CurrentComponent = sceneMap[current.condition];
  const OutgoingComponent = outgoing ? sceneMap[outgoing.condition] : null;
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isInitial) {
    return (
      <div className="absolute inset-0 overflow-hidden rounded-t-[30px]">
        <div
          key={current.key}
          className="absolute inset-0"
          style={{ animation: prefersReduced ? undefined : "ww-sceneInitialFade 150ms ease-out both" }}
        >
          <CurrentComponent />
        </div>
      </div>
    );
  }

  const forward = activeDirection >= 0;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-t-[30px]">
      {outgoing && OutgoingComponent && (
        <div
          key={`out-${outgoing.key}`}
          aria-hidden
          className="absolute inset-0"
          style={{
            animation: prefersReduced
              ? "ww-sceneInitialFade 120ms ease-out both reverse"
              : `ww-sceneOut${forward ? "Forward" : "Backward"} 520ms cubic-bezier(0.3,0,1,1) forwards`,
            willChange: "opacity, transform, filter",
          }}
          onAnimationEnd={() => setOutgoing(null)}
        >
          <OutgoingComponent />
        </div>
      )}
      <div
        key={current.key}
        className="absolute inset-0"
        style={
          outgoing
            ? {
                animation: prefersReduced
                  ? "ww-sceneInitialFade 150ms ease-out both"
                  : `ww-sceneIn${forward ? "Forward" : "Backward"} 520ms cubic-bezier(0.22,1,0.36,1) forwards`,
                willChange: "opacity, transform, filter",
              }
            : undefined
        }
      >
        <CurrentComponent />
      </div>
    </div>
  );
}
