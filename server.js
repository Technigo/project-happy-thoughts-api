import express from "express";
import cors from "cors";
import connectDB from "./config/db";

const port = process.env.PORT || 8080;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
