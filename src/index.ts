import express from "express";
import * as fs from "node:fs";

export const app = express()

const DATA_PATH = process.env.NODE_ENV === "test"
  ? "./src/cities.test.json"
  : "./src/cities.json";

app.use(express.json());


function getCities() {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"))
}

app.get("/", (req, res) => {
    res.json({
        message: "Bienvenue sur WeatherAPI !"
    })
})

app.get("/cities", (req, res) => {
    const cities = getCities();
    res.json(cities);
})

app.get("/cities/:zipCode", (req, res) => {
    try {
        const cities = getCities();
        const zip = String(req.params.zipCode);
        const city = cities.find((c: { zipCode: string; }) => c.zipCode === zip);

        if(!city) {
            return res.status(404).json({ error: "Ville non trouvée"});
        }

        res.json(city);
    } catch (err) {
        res.status(500).json({ error: "Erreur interne" });
    }
});