import { CitySearch } from "./components/search/CitySearch";
import { WeatherWidget } from "./components/weather/WeatherWidget";
import { WeatherWizardEntrance } from "./components/brand/WeatherWizardEntrance";
import { useWeather } from "./hooks/useWeather";
import { useCustomCursor } from "./hooks/useCustomCursor";

export default function App() {
  useCustomCursor(true);
  const { city, country, forecast, selectedIndex, setSelectedIndex, status, error, unit, setUnit, searchWeather } = useWeather();

  return (
    <div className="min-h-screen bg-white">
      {/* generous whitespace - widget is the product */}
      <main className="mx-auto flex min-h-screen max-w-[880px] flex-col items-center px-4 py-10 md:py-14">
        {/* brand entrance — Premium 1.8s staged (wave→swoosh→wordmark→sweep), sessionOnce + reduced-motion */}
        <div className="mb-8 flex w-full flex-col items-center">
          <h1 className="sr-only">Weather Wizard</h1>
          <WeatherWizardEntrance maxWidth={380} mode="sessionOnce" />
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
        </div>

        <footer className="mt-auto flex w-full justify-center pt-14">
          <div className="w-full border-b border-dashed border-[#DDE3EC] pb-7 text-center">
            <p className="text-center text-[14px] font-[500] leading-[1.5] tracking-[-0.01em] text-[#111827]">
              Weather Wizard © 2026 - Design + Code by{" "}
              <a
                href="https://www.gadnex.us/"
                target="_blank"
                rel="noreferrer"
                className="font-[600] text-[#2563EB] transition-colors duration-200 hover:text-[#1D4ED8]"
              >
                Gad Mollel
              </a>
              .
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
