import express from "express";
import citiesRouter from "./routes/cities.ts";
import weatherRouter from "./routes/weather.ts";

const app = express();
app.use(express.json());

app.use("/", citiesRouter);
app.use("/cities", weatherRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

export { app };