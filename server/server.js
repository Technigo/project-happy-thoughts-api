import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { now } from "mongoose";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((error) => {
    console.log(`Cannot connect to database: ${error}`);
  });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(500).json({ error: "Service unavailable" + mongoose.connection.readyState });
  }
});

// Object model
const Thought = new mongoose.model("Thought", {
  message: {
    type: String,
    required: [true, "Thought is required"],
    validate: [
      {
        validator: (thoughtValue) => {
          return thoughtValue.length >= 5;
        },
        message: "Thought must be longer than 5 characters, please try again.",
      },
      {
        validator: (thoughtValue) => {
          return thoughtValue.length <= 141;
        },
        message: "Thought must be shorter than 140 characters, please try again",
      }
    ]
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }, 
});

// Clearing and populating database
if (process.env.RESET_DATABASE) {
  const resetDatabase = async () => {
    await Thought.deleteMany();
  };
  resetDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/thoughts", async(req, res) => {
  //   //return maximum 20 thoughts, sorted by createdAt to show the most recent thoughts first
  try {
    console.log(`GET /thoughts`);
    const thoughtsList = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.status(200).json(thoughtsList);
  } catch (error) {
    res
      .status(404)
      .json({ message: `Couldn't find any thoughts`, errors: error.errors });
  }
});

app.post("/thoughts", async (req, res) => {
  try {
    const { message } = req.body
    const newThought = await new Thought({message: req.body.message}).save();
    console.log(`POST /thoughts/thought`);
    res.status(200).json(newThought);

    //expects a JSON body with the thought message { "message": "Express is great!"} If valid, save and include saved thought object
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Could not save the thought to the database", error });
  }
});

app.post("/thoughts/:thoughtID/likes", async(req, res) => {
  //   //Doesn't require JSON body. Given a valid thought id in the URL, the API should find that thougt and update its hearts proprerty to add one heart
  try {
    await Thought.updateOne({ _id: req.params.thoughtID }, { $inc: { hearts: 1 } });
    console.log(`${likes}`)
    res.status(201).json();
  } catch (error) {
    res.status(400).json({ message: "Thought was not found in the database", error });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
