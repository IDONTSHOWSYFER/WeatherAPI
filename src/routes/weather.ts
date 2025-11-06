import express from "express";
import * as fs from "node:fs";
import e, { Router } from "express";

const router = Router();

//export const app = express()

const DATA_PATH = process.env.NODE_ENV === "test"
  ? "./src/data/weather.test.json"
  : "./src/data/weather.json";

//app.use(express.json());


function getWeathers() {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"))
}

function saveWeathers(data: any) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

router.get("/:zipCode/weather", (req, res) => {
    try {
        const weathers = getWeathers();
        const zip = String(req.params.zipCode);
        const weather = weathers.find((c: { zipCode: string; }) => c.zipCode === zip);

        if(!weather) {
            return res.status(404).json({ error: "Bulletin météo non trouvée"});
        }

        res.json(weather);
    } catch (err) {
        res.status(500).json({ error: "Erreur interne" });
    }
});


router.get("/:zipCode/weathers", (req, res) => {
    const weather = getWeathers();
    res.json(weather);
});

export default router