import type { ForecastDay, WeatherCondition, WeatherData } from "../types/weather";
import { formatCityDayLabel, formatDayLabel, mapOpenWeatherToCondition } from "../lib/weatherMapping";

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
    dt_txt: string;
    main: { temp: number; humidity: number };
    weather: Array<{ main: string; description: string; icon: string }>;
    wind: { speed: number };
  }>;
  city: { name: string; country: string; timezone: number };
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
  const tz = data.city.timezone ?? 0;

  // Group by city-local date (dt is UTC seconds, add timezone offset)
  const byDate = new Map<string, typeof data.list>();
  for (const item of data.list) {
    const local = new Date((item.dt + tz) * 1000);
    const key = `${local.getUTCFullYear()}-${local.getUTCMonth()}-${local.getUTCDate()}`;
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(item);
  }

  const days: ForecastDay[] = [];
  let idx = 0;
  for (const [, items] of byDate) {
    if (idx >= 5) break;

    // Most frequent condition for the day (mode), not just mid item
    const freq = new Map<WeatherCondition, { count: number; sample: (typeof items)[number] }>();
    for (const it of items) {
      const w = it.weather[0];
      const c = mapOpenWeatherToCondition(w.main, w.description, w.icon);
      const entry = freq.get(c);
      if (!entry) freq.set(c, { count: 1, sample: it });
      else entry.count++;
    }
    let best: WeatherCondition | null = null;
    let bestCount = -1;
    let bestSample: (typeof items)[number] = items[Math.floor(items.length / 2)] ?? items[0];
    for (const [c, { count, sample }] of freq) {
      if (count > bestCount) {
        bestCount = count;
        best = c;
        bestSample = sample;
      }
    }
    const condition = best ?? mapOpenWeatherToCondition(bestSample.weather[0].main, bestSample.weather[0].description, bestSample.weather[0].icon);
    const w = bestSample.weather[0];

    // City-local date for label (use UTC getters on offset date)
    const midLocal = new Date((bestSample.dt + tz) * 1000);
    // Create a Date whose local getters match city local (trick: keep UTC)
    const date = new Date(Date.UTC(midLocal.getUTCFullYear(), midLocal.getUTCMonth(), midLocal.getUTCDate(), 12, 0, 0));
    const avgTemp = Math.round(items.reduce((a, b) => a + b.main.temp, 0) / items.length);
    // Format using UTC to preserve city day/month
    const label = formatCityDayLabel(midLocal, false);
    const shortLabel = formatCityDayLabel(midLocal, true);
    days.push({
      date,
      label,
      shortLabel,
      temperature: avgTemp,
      condition,
      description: w.description,
      humidity: Math.round(items.reduce((a, b) => a + b.main.humidity, 0) / items.length),
      windSpeed: bestSample.wind.speed,
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
