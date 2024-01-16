import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// import thoughtsRouter from './routes/thoughtsRouter.js';
import router from "./routes/thoughts-router.js";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(less => console.log("Connected to MongoDB")).catch(err => console.log("Error connecting to MongoDB", err));
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Start defining your routes here
app.use("/", router);
app.use("/thoughts", router);

// Start defining your routes here
app.get("/", (req, res) => {
  res.json([
    {
      message: "Welcome to my thoughts API",
      message: "This is a REST API for my thoughts",
    },
    {
      "paths": [ "/thoughts", "/thoughts/:thoughtId/like" ],
      "methods": [ "GET", "POST" ],
      "description": "Get all thoughts or post a new thought",
      "query": [ "message", "name" ],
      "body": [ "message", "name" ],
      "example": "/thoughts?message=Happy%20thoughts&name=Anonymous"
    }
      
  ]);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
