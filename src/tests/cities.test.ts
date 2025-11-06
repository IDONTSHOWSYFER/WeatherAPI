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
})

