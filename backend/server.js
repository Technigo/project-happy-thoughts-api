import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import thoughtRoutes from "./routes/thoughtRoutes";
import { ThoughtModel } from "./models/Thought";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  mongoose.connection.readyState === 1
    ? next()
    : res.status(503).json({ error: "Service Unavailable" });
});

app.use(thoughtRoutes);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/get", (req, res) => {});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
