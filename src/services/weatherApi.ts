import type { ForecastDay, WeatherCondition, WeatherData } from "../types/weather";
import { formatDayLabel, mapOpenWeatherToCondition } from "../lib/weatherMapping";

const BASE = "https://api.openweathermap.org/data/2.5";

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined;
  if (!key) throw new Error("Missing VITE_OPENWEATHER_API_KEY. Add it to your .env file.");
  return key;
}

interface OWMWeatherResponse {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number; deg?: number };
  dt: number;
}

interface OWMForecastResponse {
  list: Array<{
    dt: number;
    main: { temp: number; humidity: number };
    weather: Array<{ main: string; description: string; icon: string }>;
    wind: { speed: number };
  }>;
  city: { name: string; country: string };
}

export async function getWeather(city: string): Promise<WeatherData> {
  const key = getApiKey();
  const res = await fetch(
    `${BASE}/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error("We couldn't find that location. Try another city.");
    if (res.status === 401) throw new Error("Invalid API key. Check VITE_OPENWEATHER_API_KEY.");
    throw new Error("Weather unavailable. Please try again.");
  }
  const data: OWMWeatherResponse = await res.json();
  const w = data.weather[0];
  const condition = mapOpenWeatherToCondition(w.main, w.description, w.icon);
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition,
    description: w.description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg,
    icon: w.icon,
    date: new Date(data.dt * 1000),
  };
}

export async function getForecast(city: string): Promise<ForecastDay[]> {
  const key = getApiKey();
  const res = await fetch(
    `${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${key}&units=metric`
  );
  if (!res.ok) {
    // fallback to empty — caller will handle
    if (res.status === 404) throw new Error("We couldn't find that location. Try another city.");
    throw new Error("Forecast unavailable.");
  }
  const data: OWMForecastResponse = await res.json();

  // Group by date (local)
  const byDate = new Map<string, typeof data.list>();
  for (const item of data.list) {
    const d = new Date(item.dt * 1000);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(item);
  }

  const days: ForecastDay[] = [];
  let idx = 0;
  for (const [, items] of byDate) {
    if (idx >= 5) break;
    // pick midday item or middle
    const mid = items[Math.floor(items.length / 2)] ?? items[0];
    const w = mid.weather[0];
    const condition: WeatherCondition = mapOpenWeatherToCondition(w.main, w.description, w.icon);
    const date = new Date(mid.dt * 1000);
    const avgTemp = Math.round(items.reduce((a, b) => a + b.main.temp, 0) / items.length);
    days.push({
      date,
      label: formatDayLabel(date, false),
      shortLabel: formatDayLabel(date, true),
      temperature: avgTemp,
      condition,
      description: w.description,
      humidity: Math.round(items.reduce((a, b) => a + b.main.humidity, 0) / items.length),
      windSpeed: mid.wind.speed,
    });
    idx++;
  }

  // If forecast returns less than 5 (edge), pad is not needed
  return days;
}

export function mockForecast(): ForecastDay[] {
  const today = new Date();
  const add = (n: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() + n);
    return d;
  };
  return [
    { date: add(0), label: formatDayLabel(add(0)), shortLabel: formatDayLabel(add(0), true), temperature: 36, condition: "sunny", description: "Sunny" },
    { date: add(1), label: formatDayLabel(add(1)), shortLabel: formatDayLabel(add(1), true), temperature: 33, condition: "partly-cloudy", description: "Partly cloudy" },
    { date: add(2), label: formatDayLabel(add(2)), shortLabel: formatDayLabel(add(2), true), temperature: 26, condition: "cloudy", description: "Cloudy" },
    { date: add(3), label: formatDayLabel(add(3)), shortLabel: formatDayLabel(add(3), true), temperature: 22, condition: "rain", description: "Rain" },
    { date: add(4), label: formatDayLabel(add(4)), shortLabel: formatDayLabel(add(4), true), temperature: 8, condition: "rain", description: "Rain" },
  ];
}
