import { describe, it, expect, beforeEach, afterAll, afterEach } from "vitest";
import request from "supertest";
import { writeFileSync } from "fs";
import { app } from "../index.js";

const DATA_PATH = process.env.NODE_ENV === "test"
  ? "./src/cities.test.json"
  : "./src/cities.json";

  
beforeEach(() => {
  writeFileSync(DATA_PATH, JSON.stringify([], null, 2));
});

afterEach(() => {
  writeFileSync(DATA_PATH, JSON.stringify([], null, 2))
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
})