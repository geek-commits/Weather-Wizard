import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          scenes: [
            "./src/components/weather/WeatherScene/SunnyScene.tsx",
            "./src/components/weather/WeatherScene/PartlyCloudyScene.tsx",
            "./src/components/weather/WeatherScene/CloudyScene.tsx",
            "./src/components/weather/WeatherScene/RainScene.tsx",
            "./src/components/weather/WeatherScene/SnowScene.tsx",
          ],
          sound: ["./src/lib/sound/sound-engine.ts"],
        },
      },
    },
  },
})
