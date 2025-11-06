import express from "express";
import citiesRouter from "./routes/cities.ts";
import weatherRouter from "./routes/weather.ts";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Test"
    });
});

app.use("/cities", citiesRouter);
app.use("/weather", weatherRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { app };


/* import { app } from "./routes/index.ts";

const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`))
*/