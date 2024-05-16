import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

//Importing the Model
import { Thought } from "./models/thoughtSchema";

// Getting the dotenv file
dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-thoughts-api";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// API documentation
app.get("/", (req, res) => {
  try {
    const endpoints = expressListEndpoints(app).map((endpoint) => {
      if (endpoint.path === "/thoughts") {
        endpoint.query = {
          description: `Here you can send a GET request to get the last 20 thoughts in a decending order. As well as posting a new thought to the API with a POST request. Please include a JSON with the message like that: { "message": "My Happy Thought" }`,
        };
      }
      if (endpoint.path === "/thoughts/:thoughtId/like") {
        endpoint.query = {
          description:
            "On this endpoint you can like a thought by sending a POST request. Please provide the Id of the desired thought for it to work.",
        };
      }
      return endpoint;
    });
    res.status(200).json(endpoints);
  } catch (error) {
    console.error("The following error occured:", error);
    res
      .status(500)
      .send(
        "Sorry, this page is not available at the moment. Please try again later."
      );
  }
});

//GET the thoughts endpoint
//Also sorting them in a decending order and limit the thoughts to 20 shown
app.get("/thoughts", async (req, res) => {
  try {
    const allThoughts = await Thought.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

    if (allThoughts.length > 0) {
      res.status(200).json(allThoughts);
    } else {
      res.status(404).send("No Thoughts were found.");
    }
  } catch (error) {
    console.error("The following error occured:", error);
    res
      .status(500)
      .send(
        "Sorry, this page is not available at the moment. Please try again later."
      );
  }
});

//POST the thoughts endpoint
app.post("/thoughts", async (req, res) => {
  const { message, hearts, createdAt, _id } = req.body;

  try {
    const thought = await new Thought({
      message,
      hearts,
      createdAt,
      _id,
    }).save();
    res.status(201).json(thought);
  } catch (error) {
    res
      .status(400)
      .send(
        "There has been an error with posting your thought. Please ensure that your message is at least 5 characters long and has a maximum of 140 characters."
      );
  }
});

//POST Endpoint for adding a heart
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const likeThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true, runValidators: true }
    );

    if (likeThought) {
      res.status(200).json(likeThought);
    } else {
      res
        .status(404)
        .send("There is no Thought with that ID. Please try another one.");
    }
  } catch (error) {
    res
      .status(500)
      .send(
        "Sorry, this page is not available at the moment. Please try again later."
      );
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
