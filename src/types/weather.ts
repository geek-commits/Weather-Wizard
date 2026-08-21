export type WeatherCondition =
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "rain"
  | "storm"
  | "snow"
  | "fog";

export type TemperatureUnit = "celsius" | "fahrenheit";

export interface WeatherData {
  city: string;
  country?: string;
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection?: number;
  icon: string;
  date: Date;
}

export interface ForecastDay {
  date: Date;
  label: string;
  shortLabel: string;
  temperature: number;
  condition: WeatherCondition;
  description: string;
  humidity?: number;
  windSpeed?: number;
}

export type WeatherStatus = "idle" | "loading" | "success" | "error";

export interface WeatherTheme {
  skyFrom: string;
  skyTo: string;
  glow: string;
  primary: string;
  secondary: string;
}
