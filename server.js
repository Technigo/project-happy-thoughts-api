import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import { Thought } from "./models/thought.js";

// Set up MongoDB URL
const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost:27017/happy-thoughts";

// Connect to MongoDB
// useNewUrlParser: true means use a newer connecting system which makes the server to be more stable
// useUnifiedTopology: true means use a newer search engine which makes the connection to be more efficient
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// API
const routes = [
  {
    path: "/thoughts",
    method: "get",
    description: "Get the last 20 thoughts in descending order",
    handler: async (req, res) => {
      try {
        const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
        res.json(thoughts);
      } catch (error) {
        console.error("Error fetching thoughts", error);
        res.status(500).json({ message: "Server error" });
      }
    },
  },
  {
    path: "/thoughts",
    method: "post",
    description: "Post a new thought with a message",
    handler: async (req, res) => {
      const { message } = req.body;
      if (message.length < 5 || message.length > 140) {
        return res
          .status(400)
          .json({
            message: "Please type between between 5 and 140 characters",
          });
      }
      try {
        const newThought = new Thought({ message });
        await newThought.save();
        res.status(201).json(newThought);
      } catch (error) {
        console.error("Error posting thought:", error);
        res.status(500).json({ message: "Server error" });
      }
    },
  },
  {
    path: "/thoughts/:thoughtId/like",
    method: "post",
    description: "Like a thought by providing the thought ID",
    handler: async (req, res) => {
      const { thoughtId } = req.params;
      try {
        const likedThought = await Thought.findByIdAndUpdate(
          thoughtId,
          { $inc: { hearts: 1 } },
          { new: true }
        );
        if (likedThought) {
          res.status(200).json(likedThought);
        } else {
          res.status(404).json({ message: "Thought not found " });
        }
      } catch (error) {
        console.error("Error liking thought:", error);
        res.status(500).json({ message: "Server error" });
      }
    },
  },
];

routes.forEach((route) => {
  app[route.method](route.path, route.handler);
});

// API endpoints
app.get("/", (req, res) => {
  try {
    const endpoints = expressListEndpoints(app).map((endpoint) => {
      const matchedRoute = routes.find((route) => route.path === endpoint.path);
      if (matchedRoute) {
        endpoint.description = matchedRoute.description;
      }
      return endpoint;
    });
    res.status(200).json(endpoints);
  } catch (error) {
    console.error("Error generating API documentation:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
