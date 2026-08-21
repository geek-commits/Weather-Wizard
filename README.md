# Weather Wizard 🌦️

Modern, minimal weather widget — a close visual reconstruction of the **Inspora Weather Widget — Light Mode** by [@raul_dronca](https://www.inspora.design/posts/4-3), translated into **Weather Wizard** with its original OpenWeatherMap functionality preserved.

> **Reference:** Inspora Weather Widget Light Mode ([inspora.design/posts/4-3](https://www.inspora.design/posts/4-3)) is the visual source of truth. The uploaded 2876×2160 @60FPS reference video drove the dynamic scene system. This redesign is a faithful implementation, not a loose "inspired by" interpretation.

## ✨ Features

- Premium entrance — `weather-wizard-entrance.svg` 1.8s staged (wave→swoosh→wordmark→sweep) `sessionOnce` + `prefers-reduced-motion`
- City search (Enter or button), persisted to `localStorage`
- Live temperature (dominant typography), condition, humidity, wind
- **Dynamic weather scenes** — custom SVG/CSS artwork per condition (Sunny / Partly Cloudy / Cloudy / Rain / Storm / Snow / Fog) with Premium triple-layer morph `520ms signature` (scale+opacity / blur / glow drift)
- **Forecast selector** — 5-day horizontal pill tabs micro-cascade `22ms` per pill; selecting a day morphs scene + staged temp/condition cascade
- **°F / °C segmented toggle** (persisted) with white pill active state
- Responsive from 320px to 1920px, intentional 380px widget centered in generous whitespace
- Loading skeletons that preserve geometry, designed empty/error states
- Keyboard + screen-reader accessible, `prefers-reduced-motion` respected throughout
- Demo mode when no API key is set (mock forecast, city still updates)

## 🛠 Tech Stack

- **React 19** + **TypeScript 5.9** (strict)
- **Vite 6.4**
- **Tailwind CSS 4** (`@tailwindcss/vite`) + CSS variables for palette
- **Inter** (Google Fonts) — tabular nums for temperature
- **Lucide React** for line icons (weather icons)
- **OpenWeatherMap** (`/weather` + `/forecast`, `units=metric`, client-side C↔F conversion)

## 📁 Project Structure

```
weather-wizard/
├── legacy/index.html            # original single-file snapshot
├── public/favicon.svg
├── src/
│   ├── components/brand/WeatherWizardEntrance.tsx # 1.8s entrance (wave/swoosh/wordmark/sweep)
│   ├── components/weather/
│   │   ├── WeatherWidget.tsx    # composition, stable geometry, a11y region
│   │   ├── WeatherHeader.tsx    # city + date + UnitToggle
│   │   ├── UnitToggle.tsx       # segmented °F/°C
│   │   ├── WeatherScene.tsx     # router → Sunny/PartlyCloudy/Cloudy/Rain/Storm/Snow/Fog (Premium morph)
│   │   ├── WeatherScene/*.tsx   # SVG + gradients + blur scenes
│   │   ├── WeatherInformation.tsx # staged temp/line/icon
│   │   ├── WeatherIcon.tsx
│   │   └── ForecastSelector.tsx # micro-cascade
│   ├── components/search/CitySearch.tsx  # external to widget, minimal
│   ├── hooks/useWeather.ts, useReducedMotion.ts
│   ├── services/weatherApi.ts   # normalized WeatherData, forecast aggregation (city TZ + mode)
│   ├── types/weather.ts
│   ├── lib/utils.ts, weatherMapping.ts, unit.ts, motion.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── vite.config.ts
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node 26.7.0 (or ≥18), npm ≥10
- Modern browser (Chrome, Firefox, Safari, Edge)
- Free [OpenWeatherMap API key](https://openweathermap.org/api) (optional — demo mode works without it)

### Installation

```bash
git clone <repo>
cd Weather-Wizard
npm install
cp .env.example .env
# edit .env and set VITE_OPENWEATHER_API_KEY=your_key_here
npm run dev
```

Open `http://localhost:5173`.

### Environment Variables

```env
# .env
VITE_OPENWEATHER_API_KEY=your_openweathermap_key
```

`src/services/weatherApi.ts:8` throws a clear config error if missing. No key is ever committed — see `.gitignore`.

### Build

```bash
npm run build   # tsc -b && vite build
npm run preview # preview dist/
npm run lint    # oxlint
```

## 🎯 How to Use

1. Type a city in the search above the widget (e.g. `Dar es Salaam`, `Chicago`)
2. Press **Enter** or click **Search**
3. Toggle **°F / °C** top-right of the widget
4. Tap forecast pills `Mon 3 … Fri` to morph the scene

Last city and unit are restored on reload.

## 🎨 Design Notes

- **Widget geometry:** ~380px, `rounded-[30px]`, `1px rgba(0,0,0,0.06)` border, diffuse `0 20px 60px rgba(15,23,42,0.08)` shadow, surface `#F3F4F8` on `#FFFFFF` page.
- **Typography:** Inter, temperature `64-68px` weight 520 `tracking -0.06em tabular-nums`; condition `14px` medium; header `18px` semi-bold.
- **Motion:** Premium `signature 0.22,1,0.36,1` — entrance `1.8s`, scene `520ms` (scale+opacity) + `420ms` blur + ambient drift; info `380ms temp` + `260ms` lines stagger `60/120ms`; forecast `22ms` cascade, `quick 160ms` toggle, three layers every animation, 1/3 rules.
- **Scenes:** SVG ellipses/circles + radial gradients + `blur()`; transitions `520ms signature` on `opacity/transform/blur`.
- **No dashboard chrome:** navbar/sidebar/footer deliberately omitted — widget *is* the product.

## 🔒 Legacy

Original implementation preserved at `legacy/index.html` (single HTML with embedded CSS/JS per spec §7).

## 📄 License

MIT — see [LICENSE](LICENSE).

## 🙏 Credits

- Visual reference: Inspora Weather Widget Light Mode by [@raul_dronca](https://www.rauldronca.com) via [inspora.design](https://www.inspora.design/posts/4-3)
- Weather data: [OpenWeatherMap](https://openweathermap.org/api)
- Original Weather Wizard: [Geek_Mollel](mailto:gadjosephat098@gmail.com) / [github.com/geek-commits/webdev](https://github.com/geek-commits/webdev.git)
