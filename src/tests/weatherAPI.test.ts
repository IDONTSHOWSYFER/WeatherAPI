import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { writeFileSync } from "fs";
import { app } from "../server";

const CITIES_PATH =
  process.env.NODE_ENV === "test"
    ? "./src/data/cities.test.json"
    : "./src/data/cities.json";

const WEATHER_PATH =
  process.env.NODE_ENV === "test"
    ? "./src/data/weather.test.json"
    : "./src/data/weather.json";

beforeEach(() => {
  writeFileSync(CITIES_PATH, JSON.stringify([], null, 2));
  writeFileSync(WEATHER_PATH, JSON.stringify([], null, 2));
});

afterEach(() => {
  writeFileSync(CITIES_PATH, JSON.stringify([], null, 2));
  writeFileSync(WEATHER_PATH, JSON.stringify([], null, 2));
});

describe("API Weather", () => {
  it("POST /cities => crée une ville", async () => {
    const city = { zipCode: "21200", name: "Beaune" };
    const res = await request(app).post("/cities").send(city);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ message: "Ville ajoutée", city});
  });


  it("GET /cities => retourne la liste des villes", async () => {
    await request(app).post("/cities").send({ zipCode: "02000", name: "Aisne" });

    const res = await request(app).get("/cities");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({ zipCode: "02000", name: "Aisne" });
  });


  it("GET /cities/:zipCode => retourne une ville spécifique", async () => {
    await request(app).post("/cities").send({ zipCode: "33000", name: "Bordeaux" });

    const res = await request(app).get(`/cities/33000`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ zipCode: "33000", name: "Bordeaux" });
  });


  it("POST /cities/:zipCode/weather => ajoute un bulletin météo", async () => {
    await request(app).post("/cities").send({ zipCode: "75000", name: "Paris" });

    const res = await request(app)
      .post("/cities/75000/weather")
      .send({ zipCode: "75000", weather: "beau" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(typeof res.body.id).toBe("number");
  });

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

  it("GET /cities/:zipCode/weather => retourne la météo dominante d'une ville", async () => {
    await request(app).post("/cities").send({ zipCode: "13000", name: "Marseille" });
    
    await request(app)
      .post("/cities/13000/weather")
      .send({ zipCode: "13000", weather: "pluie" });

    await request(app)
      .post("/cities/13000/weather")
      .send({ zipCode: "13000", weather: "beau" });

    await request(app)
      .post("/cities/13000/weather")
      .send({ zipCode: "13000", weather: "pluie" });

    const res = await request(app).get(`/cities/13000/weather`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      zipCode: "13000",
      name: "Marseille",
      weather: "pluie",
    });
  });

  it("POST /cities/:zipCode/weather => retourne la météo dominante d'une ville", async () => {
    await request(app).post("/cities").send({ zipCode: "21200", name: "Beaune" });

    const res = await request(app)
      .post("/cities/21200/weather")
      .send({ zipCode: "21200", weather: "beau" });

    expect(res.status).toBe(201);
    expect(res.body.weather).toBe("beau");
    expect(res.body.message).toBe("Bulletin météo ajouté :");
  })
});