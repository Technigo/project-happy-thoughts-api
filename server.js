import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
//import { thougthSchema } from "./schema";
import { corsMiddleware, jsonMiddleware, mongoConnectionMiddleware } from "./middleware";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// PORT=8080 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(corsMiddleware);
app.use(jsonMiddleware);
app.use(mongoConnectionMiddleware);

//Thought Schema
const { Schema } = mongoose;

const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

//Thought model
const Thought = mongoose.model("Thought", thoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  const documentation = {
    Welcome: "This is the Happy Thoughts API!",
    Endpoints: endpoints,
  };
  res.json(documentation);
});

app.post("/thoughts", async (req, res) => {
  try {
    const { message } = req.body;
    const thought = new Thought({ message });
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
