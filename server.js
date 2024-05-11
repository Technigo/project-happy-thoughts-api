import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import expressListEndpoints from "express-list-endpoints";

dotenv.config();

//establish connection to MongoDB database using Mongoose
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

//define thoughts model

//defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

//add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

//endpoint to get 20 thoughts sorted by createdAt (GET/thoughts)

//endpoint to post thoughts (POST/thoughts)

//endpoint to add hearts/likes to the thougth

//add API to old happy thoughts project

//update readme and open pull request

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
