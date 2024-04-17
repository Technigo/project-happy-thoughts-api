import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ThoughtsRoutes from "./routes/ThoughtsRoutes";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/happy-thought-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();

const port = process.env.PORT || 9090;

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(ThoughtsRoutes);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
