/**
 * Vercel Serverless Function — proxy to OpenWeatherMap /weather
 * Reads OPENWEATHER_API_KEY server-side (never VITE_), caches 300s.
 */
export default async function handler(req: any, res: any) {
  const q = req.query?.q ?? new URL(req.url, `http://${req.headers.host}`).searchParams.get("q");
  if (!q || typeof q !== "string" || !q.trim()) {
    res.status(400).json({ message: "Missing q" });
    return;
  }

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    res.status(500).json({ message: "Missing server OPENWEATHER_API_KEY" });
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q.trim())}&appid=${key}&units=metric`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    // Mirror OWM status (404 city not found, 401 invalid key etc.)
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    res.status(r.status).json(data);
  } catch {
    res.status(500).json({ message: "Weather unavailable" });
  }
}
