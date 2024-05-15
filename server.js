import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

//Importing the Model
import { Thought } from "./models/ThoughtSchema";

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
//TODO Add description!
app.get("/", (req, res) => {
  try {
    const endpoints = expressListEndpoints(app);
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
app.get("/thoughts", async (req, res) => {
  try {
    const allThoughts = await Thought.find();
    console.log(allThoughts);
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
