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
  name: string;
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

router.get("/weather", (_req: Request, res: Response): void => {
  const weathers = getWeathers();
  if (weathers.length === 0) {
    res.status(404).json({ error: "Aucun bulletin météo trouvé" });
    return;
  }

  const reports = weathers.map((w) => ({
    zipCode: w.zipCode,
    townName: w.name,
    weather: w.weather,
  }));

  res.status(200).json(reports);
});

router.post("/:zipCode/weather", (req: Request, res: Response): void => {
  const zip = req.params.zipCode;
  const { zipCode, weather } = req.body as {
    zipCode?: string;
    weather?: WeatherType;
  };

  const allowed: WeatherType[] = ["pluie", "beau", "neige"];

  if (!zipCode || String(zipCode) !== zip || !allowed.includes(weather as WeatherType)) {
    res.status(400).json({ error: "Requête invalide" });
    return;
  }

  const city = getCities().find((c) => c.zipCode === zip);
  if (!city) {
    res.status(404).json({ error: "Ville non trouvée" });
    return;
  }

  const list = getWeathers();
  const nextId = list.length ? Math.max(...list.map((w) => w.id)) + 1 : 1;

  list.push({ id: nextId, zipCode, name: city.name, weather: weather as WeatherType });
  saveWeathers(list);

  res.status(201).json({message: "Bulletin météo ajouté :", weather: weather,  id: nextId });
});

router.delete("/:zipCode/weather/:id", (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  const list = getWeathers();
  const index = list.findIndex((w) => w.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Bulletin météo non trouvé" });
    return;
  }

  list.splice(index, 1);
  saveWeathers(list);

  res.status(200).json({});
});

export default router;