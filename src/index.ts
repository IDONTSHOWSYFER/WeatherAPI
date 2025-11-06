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