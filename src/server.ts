import express from "express";
import citiesRouter from "./routes/cities.ts";
import weatherRouter from "./routes/weather.ts";
import logger from "./logger.ts";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        logger.info(
            {method: req.method, url: req.originalUrl, status: res.statusCode, duration },
        );
    });
    next();
});

app.use("/", citiesRouter);
app.use("/cities", weatherRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

export { app };