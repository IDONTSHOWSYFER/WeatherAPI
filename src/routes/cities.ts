import express from "express";
import * as fs from "node:fs";
import { Router } from "express";

const router = Router()

const DATA_PATH = process.env.NODE_ENV === "test"
  ? "./src/data/cities.test.json"
  : "./src/data/cities.json";

function getCities() {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"))
}

function saveCities(data: any) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

router.get("/", (req, res) => {
    res.json({
        message: "Bienvenue sur WeatherAPI !"
    })
}); 

router.get("/cities", (req, res) => {
    const cities = getCities();
    res.json(cities);
});

router.get("/cities/:zipCode", (req, res) => {
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

router.post("/cities", (req, res) => {
    const cities = getCities();
    const {zipCode, name} = req.body;

    if (!zipCode || !name) {
        return res.status(400).json({ error: "Champs manquants"});
    }

    const zipCodeExists = cities.some((c: {zipCode: string}) => c.zipCode === zipCode);
    if (zipCodeExists) {
        return res.status(409).json({ error: "Zipcode déjà existant"})
    }

    const cityExists = cities.some((c: {name: string}) => c.name === name);
    if (cityExists) {
        return res.status(409).json({ error: "Ville déjà existante"})
    }

    const newCity = {
        name,
        zipCode
    };

    cities.push(newCity);
    saveCities(cities);

    res.status(201).json({ message: "Ville ajoutée", city: newCity});
});

router.put("/cities/:zipCode", (req, res) => {
    const cities = getCities();
    const zip = String(req.params.zipCode);
    const cityIndex = cities.find((c: { zipCode: string; }) => c.zipCode === zip);

    if (cityIndex === -1) {
        return res.status(404).json({ error: "Ville non trouvée"});
    }

    const {name} = req.body;

    if (!name) {
        res.status(400).json({ error: "Champs manquants"})
    }

    cities[cityIndex] = {name};
    saveCities(cities);

    res.status(200).json({ message: "Nom de la ville mise à jour", city: cities[cityIndex]});
});

router.delete("/cities/:zipCode", (req, res) => {
    const cities = getCities();
    const zip = String(req.params.zipCode);
    const city = cities.find((c: { zipCode: string; }) => c.zipCode === zip);

    if (city === -1) {
        return res.status(404).json({ error: "Ville non trouvée"})
    }

    const removed = cities.splice(city, 1)[0];
    saveCities(cities);

    res.status(200).json({message: "Ville supprimée", city: removed})
})

export default router;