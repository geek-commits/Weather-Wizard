import type { WeatherCondition, WeatherTheme } from "../types/weather";

export function mapOpenWeatherToCondition(
  main: string,
  description: string,
  icon: string
): WeatherCondition {
  // Primary truth: OWM icon prefix is unambiguous
  const code = icon.slice(0, 2);
  if (code === "01") return "sunny"; // 01d/01n clear
  if (code === "02") return "partly-cloudy"; // 02d/02n few clouds
  if (code === "03" || code === "04") return "cloudy"; // scattered/broken
  if (code === "09" || code === "10") return "rain"; // shower/rain
  if (code === "11") return "storm"; // thunderstorm
  if (code === "13") return "snow";
  if (code === "50") return "fog"; // mist/haze/fog

  const m = main.toLowerCase();
  const d = description.toLowerCase();

  if (m === "clear") return "sunny";
  if (m === "clouds") {
    if (d.includes("few")) return "partly-cloudy";
    return "cloudy";
  }
  if (m === "drizzle" || m === "rain") return "rain";
  if (m === "thunderstorm") return "storm";
  if (m === "snow") return "snow";
  if (["mist", "fog", "haze", "smoke", "dust", "sand", "ash", "squall", "tornado"].includes(m))
    return "fog";
  return "partly-cloudy";
}

export const weatherThemes: Record<WeatherCondition, WeatherTheme> = {
  sunny: {
    skyFrom: "#FFF7ED",
    skyTo: "#FFEDD5",
    glow: "rgba(251,146,60,0.45)",
    primary: "#FB923C",
    secondary: "#FDBA74",
  },
  "partly-cloudy": {
    skyFrom: "#EFF6FF",
    skyTo: "#FFF7ED",
    glow: "rgba(96,165,250,0.35)",
    primary: "#60A5FA",
    secondary: "#FB923C",
  },
  cloudy: {
    skyFrom: "#F1F5F9",
    skyTo: "#E2E8F0",
    glow: "rgba(148,163,184,0.35)",
    primary: "#94A3B8",
    secondary: "#CBD5E1",
  },
  rain: {
    skyFrom: "#EFF6FF",
    skyTo: "#DBEAFE",
    glow: "rgba(59,130,246,0.32)",
    primary: "#3B82F6",
    secondary: "#93C5FD",
  },
  storm: {
    skyFrom: "#E0E7FF",
    skyTo: "#C7D2FE",
    glow: "rgba(79,70,229,0.38)",
    primary: "#4F46E5",
    secondary: "#6366F1",
  },
  snow: {
    skyFrom: "#F8FAFC",
    skyTo: "#E2E8F0",
    glow: "rgba(203,213,225,0.5)",
    primary: "#E2E8F0",
    secondary: "#F8FAFC",
  },
  fog: {
    skyFrom: "#F1F5F9",
    skyTo: "#E2E8F0",
    glow: "rgba(148,163,184,0.25)",
    primary: "#94A3B8",
    secondary: "#CBD5E1",
  },
};

export function formatDayLabel(date: Date, short = false): string {
  const days = short
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (short) return `${days[date.getDay()]} ${date.getDate()}`;
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

export function formatCityDayLabel(cityLocalDate: Date, short = false): string {
  // cityLocalDate is created as new Date((dt + tz)*1000), so UTC getters give city local
  const days = short
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (short) return `${days[cityLocalDate.getUTCDay()]} ${cityLocalDate.getUTCDate()}`;
  return `${days[cityLocalDate.getUTCDay()]}, ${months[cityLocalDate.getUTCMonth()]} ${cityLocalDate.getUTCDate()}`;
}

export function formatCityHeaderDate(cityLocalDate: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[cityLocalDate.getUTCDay()]}, ${months[cityLocalDate.getUTCMonth()]} ${cityLocalDate.getUTCDate()}`;
}

export function formatHeaderDate(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}
