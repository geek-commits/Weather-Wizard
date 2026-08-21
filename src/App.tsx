import { CitySearch } from "./components/search/CitySearch";
import { WeatherWidget } from "./components/weather/WeatherWidget";
import { useWeather } from "./hooks/useWeather";

export default function App() {
  const { city, country, forecast, selectedIndex, setSelectedIndex, status, error, unit, setUnit, searchWeather } = useWeather();

  const hasKey = !!import.meta.env.VITE_OPENWEATHER_API_KEY;

  return (
    <div className="min-h-screen bg-white">
      {/* generous whitespace - widget is the product */}
      <main className="mx-auto flex min-h-screen max-w-[880px] flex-col items-center px-4 py-10 md:py-14">
        {/* subtle header */}
        <div className="mb-8 text-center">
          <h1 className="text-[13px] font-[600] tracking-[0.14em] text-[#94A3B8] uppercase">Weather Wizard</h1>
          {!hasKey && (
            <p className="mt-2 max-w-[420px] text-[12px] leading-[1.6] text-[#94A3B8]">
              Demo mode — add <code className="rounded bg-[#F1F5F9] px-1 py-0.5 text-[#0F172A]">VITE_OPENWEATHER_API_KEY</code> to enable live data. City search still animates the scenes.
            </p>
          )}
        </div>

        <div className="flex w-full flex-col items-center gap-6">
          <CitySearch onSearch={searchWeather} loading={status === "loading"} />

          <WeatherWidget
            city={city}
            country={country}
            status={status}
            error={error}
            forecast={forecast}
            selectedIndex={selectedIndex}
            unit={unit}
            onSelectDay={setSelectedIndex}
            onUnitChange={setUnit}
            onRetry={() => searchWeather(city)}
          />

          <p className="max-w-[360px] text-center text-[11px] leading-[1.6] tracking-wide text-[#94A3B8]">
            Visual reference: Inspora Weather Widget by{" "}
            <a href="https://www.inspora.design/posts/4-3" target="_blank" rel="noreferrer" className="underline decoration-[#CBD5E1] underline-offset-4 hover:text-[#64748B]">
              @raul_dronca
            </a>{" "}
            — Light Mode. Scenes are custom SVG/CSS.
          </p>
        </div>

        {/* footer accent */}
        <div className="mt-auto pt-10 text-center">
          <p className="text-[11px] tracking-wide text-[#CBD5E1]">Legacy snapshot preserved at <code className="text-[#94A3B8]">legacy/index.html</code></p>
        </div>
      </main>
    </div>
  );
}
