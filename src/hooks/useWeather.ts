import { useCallback, useEffect, useRef, useState } from "react";
import type { ForecastDay, TemperatureUnit, WeatherStatus } from "../types/weather";
import { getForecast, getWeather, mockForecast } from "../services/weatherApi";

const LS_CITY = "weather-wizard:lastCity";
const LS_UNIT = "weather-wizard:unit";

export function useWeather() {
  const [city, setCity] = useState<string>(() => {
    try {
      return localStorage.getItem(LS_CITY) || "Dar es Salaam";
    } catch {
      return "Dar es Salaam";
    }
  });
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [forecast, setForecast] = useState<ForecastDay[]>(() => mockForecast());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [status, setStatus] = useState<WeatherStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    try {
      const v = localStorage.getItem(LS_UNIT) as TemperatureUnit | null;
      return v === "fahrenheit" || v === "celsius" ? v : "celsius";
    } catch {
      return "celsius";
    }
  });

  const requestIdRef = useRef(0);

  const persistUnit = useCallback((u: TemperatureUnit) => {
    setUnit(u);
    try {
      localStorage.setItem(LS_UNIT, u);
    } catch {
      // ignore
    }
  }, []);

  const searchWeather = useCallback(
    async (nextCity: string) => {
      const trimmed = nextCity.trim();
      if (!trimmed) return;

      const id = ++requestIdRef.current;
      setStatus("loading");
      setError(null);

      try {
        const [weather, fcast] = await Promise.all([getWeather(trimmed), getForecast(trimmed)]);
        if (id !== requestIdRef.current) return;
        setCity(weather.city);
        setCountry(weather.country);
        // Merge today's actual temp as first day temperature to reflect current
        const days = fcast.length ? fcast : mockForecast();
        if (days.length) days[0] = { ...days[0], temperature: weather.temperature, condition: weather.condition, description: weather.description, humidity: weather.humidity, windSpeed: weather.windSpeed };
        setForecast(days);
        setSelectedIndex(0);
        setStatus("success");
        try {
          localStorage.setItem(LS_CITY, weather.city);
        } catch {
          // ignore
        }
      } catch (e) {
        if (id !== requestIdRef.current) return;
        const msg = e instanceof Error ? e.message : "Weather unavailable.";
        setError(msg);
        setStatus("error");
      }
    },
    []
  );

  // initial auto-load — try live via /api, fallback to mock on offline/server failure
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        setStatus("loading");
        const [weather, fcast] = await Promise.all([getWeather(city), getForecast(city)]);
        if (cancelled) return;
        setCity(weather.city);
        setCountry(weather.country);
        const days = fcast.length ? fcast : mockForecast();
        if (days.length) days[0] = { ...days[0], temperature: weather.temperature, condition: weather.condition, description: weather.description };
        setForecast(days);
        setStatus("success");
      } catch {
        if (cancelled) return;
        // controlled offline/server-failure fallback — keep mock
        setStatus("success");
      }
    };
    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    city,
    country,
    forecast,
    selectedIndex,
    setSelectedIndex,
    status,
    error,
    unit,
    setUnit: persistUnit,
    searchWeather,
  };
}
