import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import expressListEndpoints from "express-list-endpoints";
import Thought from "./models/ThoughtSchema";

// Load environment variables
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

// ---- ROUTES ----

// GET API documentation
app.get("/", (req, res) => {
  try {
    const endpoints = expressListEndpoints(app);
    res.json(endpoints);
  } catch (error) {
    console.error("Error", error);
    res
      .status(500)
      .send("This page is unavailable at the moment. Please try again later.");
  }
});

// GET thoughts
app.get("/thoughts", async (req, res) => {
  const allThoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(allThoughts);
});

// POST thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    // Success case - create thought
    const thought = await new Thought({
      message,
    }).save();

    // Set success status
    res.status(201).json(thought);
  } catch (error) {
    // Failed case - return error message
    res.status(400).json({
      sucess: false,
      response: error,
      message: "Unable to create thought",
    });
  }
});

// POST like
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findById(thoughtId).exec();

    if (thought) {
      // Add one like
      thought.hearts++;
      // Save thought object
      thought.save();
      res.json(thought);
    } else {
      res.status(404).send("Could not find thought");
    }
  } catch (error) {
    console.error("Error", error);
    res.status(404).send("Could not find thought");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
