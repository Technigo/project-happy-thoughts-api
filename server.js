import express from "express";
import {} from "dotenv/config";
import cors from "cors";
import connectDB from "./config/db";
import routes from "./routes/thoughtsRoutes";

const port = process.env.PORT || 8080;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/thoughts", routes);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
