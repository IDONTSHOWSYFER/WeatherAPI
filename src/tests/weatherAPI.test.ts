import { describe, it, expect, beforeEach, afterAll, afterEach } from "vitest";
import request from "supertest";
import { writeFileSync } from "fs";
import { app } from "../server.ts";

const CITIES_PATH = process.env.NODE_ENV === "test"
  ? "./src/data/cities.test.json"
  : "./src/data/cities.json";

const WEATHER_PATH = process.env.NODE_ENV === "test"
  ? "./src/data/weather.test.json"
  : "./src/data/weather.json";

  
beforeEach(() => {
  writeFileSync(CITIES_PATH, JSON.stringify([], null, 2));
  writeFileSync(WEATHER_PATH, JSON.stringify([], null, 2));
});

afterEach(() => {
  writeFileSync(CITIES_PATH, JSON.stringify([], null, 2));
  writeFileSync(CITIES_PATH, JSON.stringify([], null, 2));
})

describe("API Weather", () => {
    it("GET /cities => retourne la liste des cities", async () => {
        const res = await request(app).get("/cities");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    })

    it("GET /cities/:zipCode => récupère une ville spécifique", async () => {
        const create = await request(app).post("/cities").send({
            zipCode: "02000",
            name: "Aisne"
        });

        const zipCode = create.body.city.zipCode;

        const res = await request(app).get(`/cities/${zipCode}`);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            zipCode,
            name: "Aisne"
        });
    });

    it("POST /cities => crée une ville", async () => {
        const city = {
            zipCode: "21200",
            name: "Beaune"
        };

        const res = await request(app)
            .post("/cities")
            .send(city)

        expect(res.status).toBe(201);
        expect(res.body.city).toMatchObject(city);
    });

    it("PUT /cities/:zipCode => Change le nom d'une ville", async () => {
    const create = await request(app).post("/cities").send({
        zipCode: "21200",
        name: "Beaune"
    });

    const zipCode = create.body.city.zipCode;

    const res = await request(app)
      .put(`/cities/${zipCode}`)
      .send({
        name: "Bonne"
      });

    expect(res.status).toBe(200);
    expect(res.body.city.name).toBe("Bonne");
    })

    it("DELETE /cities/:zipCode => supprime un contact", async () => {
    const create = await request(app).post("/cities").send({
        zipCode: "93000",
        name: "Paris"
    });

    const zipCode = create.body.city.zipCode;

    const res = await request(app).delete(`/cities/${zipCode}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Ville supprimée");
  });

  it("GET /cities/:zipCode/weather => retourne la météo la plus valuable d'une ville", async () => {
        const createCity = await request(app).post("/cities").send({
            zipCode: "02000",
            name: "Aisne"
        });

        const createWeather = await request(app).post("/cities/:zipCode/weather").send({
          zipCode: "94000",
          name : "Paris",
          weather: "beau"
        })

        const zipCode = createCity.body.city.zipCode;

        const res = await request(app).get(`/cities/${zipCode}/weather`);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            zipCode,
            name: "Paris",
            weather: "beau"
        });
  })
})

