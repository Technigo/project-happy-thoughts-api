import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import { Thought } from "./models/thought.js";

// Set up MongoDB URL: use address in environment variables or use the localhost
const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost:27017/happy-thoughts";

// Connect to MongoDB
// useNewUrlParser: true means use a newer connecting system which makes the server to be more stable
// useUnifiedTopology: true means use a newer search engine which makes the connection to be more efficient
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// Promise: handle operations that take time to finish, like fetching data from a database. 3 states: Pending, Fulfilled, Rejected
mongoose.Promise = Promise;

// Defines the port the app will run on. If there's no port number in environment variables, use port 8080.
const port = process.env.PORT || 8080;
const app = express();

// Middlewares
// CORS: make the app accessible from other domains (websites).
app.use(cors());
// allows the app to understand JSON in request bodies.
app.use(express.json());

// API - Define the routes (endpoints)
const routes = [
  {
    path: "/thoughts",
    method: "get",
    description: "Get the last 20 thoughts in descending order",
    handler: async (req, res) => {
      try {
        // `1` indicates ascending order: values sorted from smallest to largest (e.g., oldest dates to newest).
        // `-1` indicates descending order: values sorted from largest to smallest (e.g., newest dates to oldest).
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
          .status(400) // status(400): bad request, not fullfilling the condition
          .json({
            message: "Please type between between 5 and 140 characters",
          });
      }
      try {
        const newThought = new Thought({ message });
        await newThought.save();
        res.status(201).json(newThought); // status(201): a request has successfully created
      } catch (error) {
        console.error("Error posting thought:", error);
        res.status(500).json({ message: "Server error" }); // status(500): Internal Server Error
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

// these routes are added all at once to the Express application, each with its specific HTTP method and URL path and reduces code duplication 
routes.forEach((route) => {
  app[route.method](route.path, route.handler);
});

// Lists all the available endpoints in the app　-> quickly understand what endpoints are available without digging through code or documentation
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
