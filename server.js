import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import { thougthSchema } from "./schema";
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

//Thought model
const Thought = mongoose.model("Thought", thougthSchema)

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
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
