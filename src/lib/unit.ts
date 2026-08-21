import type { TemperatureUnit } from "../types/weather";

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function fahrenheitToCelsius(f: number): number {
  return Math.round(((f - 32) * 5) / 9);
}

export function displayTemp(celsius: number, unit: TemperatureUnit): number {
  return unit === "fahrenheit" ? celsiusToFahrenheit(celsius) : Math.round(celsius);
}

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  return `${displayTemp(celsius, unit)}°`;
}
