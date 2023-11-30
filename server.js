import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// In order to replace the API we built, you're going to need to build a `Thought` Mongoose model which has properties for the `message` string, a `heart` property for tracking the number of likes, and a `createdAt` property to store when the thought was added.

const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500,
  },
  heart: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Emmy!");
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  //Retrieve the information sent by the user to our API endpoint
  const { message } = req.body;

  //Use the mongoose model to create the database entry
  const thought = new Thought({ message, heart });

  try {
    //Success
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res
      .status(400)
      .json({
        message: "Oh no, could not add the thought to the Database",
        error: err.errors,
      });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
