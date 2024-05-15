import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import expressListEndpoints from "express-list-endpoints";

// Configure dotenv
dotenv.config();

// Set up mongoURL and localhost
const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/happy-thoughts-api";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// ---- MIDDLEWARES ----

// Middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
// Middleware to check database status
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
