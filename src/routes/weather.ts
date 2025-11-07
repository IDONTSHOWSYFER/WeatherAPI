import { Router, Request, Response } from "express";
import * as fs from "node:fs";

const router = Router();

type WeatherType = "pluie" | "beau" | "neige";

interface City {
  zipCode: string;
  name: string;
}

interface WeatherReport {
  id: number;
  zipCode: string;
  townName: string;
  weather: WeatherType;
}

const CITIES_PATH =
  process.env.NODE_ENV === "test"
    ? "./src/data/cities.test.json"
    : "./src/data/cities.json";

const WEATHER_PATH =
  process.env.NODE_ENV === "test"
    ? "./src/data/weather.test.json"
    : "./src/data/weather.json";

const getCities = (): City[] =>
  JSON.parse(fs.readFileSync(CITIES_PATH, "utf-8"));

const getWeathers = (): WeatherReport[] => {
  if (!fs.existsSync(WEATHER_PATH)) return [];
  const raw = fs.readFileSync(WEATHER_PATH, "utf-8");
  return raw ? (JSON.parse(raw) as WeatherReport[]) : [];
};

const saveWeathers = (data: WeatherReport[]): void =>
  fs.writeFileSync(WEATHER_PATH, JSON.stringify(data, null, 2));

const dominantWeather = (entries: WeatherReport[]): WeatherType => {
  const tally: Record<WeatherType, number> = { pluie: 0, beau: 0, neige: 0 };
  for (const e of entries) tally[e.weather]++;
  return (Object.keys(tally) as WeatherType[]).reduce((a, b) =>
    tally[a] >= tally[b] ? a : b
  );
};

router.get("/:zipCode/weather", (req: Request, res: Response): void => {
  const zip = req.params.zipCode;
  const city = getCities().find((c) => c.zipCode === zip);
  if (!city) {
    res.status(404).json({ error: "Ville non trouvée" });
    return;
  }
  const reports = getWeathers().filter((w) => w.zipCode === zip);
  if (reports.length === 0) {
    res.status(404).json({ error: "Aucun bulletin pour cette ville" });
    return;
  }
  const weather = dominantWeather(reports);
  res.status(200).json({ zipCode: city.zipCode, name: city.name, weather });
});

export default router;