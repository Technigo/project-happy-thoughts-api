import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import getEndpoints from "express-list-endpoints";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-happythought-API";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

//SCHEMA
const HappyThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: String,
    default: () =>
      new Date(Date.now()).toLocaleString("sv-SE", {
        timeZone: "Europe/Stockholm",
      }),
  },
});

//MONGOOSE MODEL
const Thought = mongoose.model("Thought", HappyThoughtSchema);

//ROUTES
//overview on first page
app.get("/", (req, res) => {
  res.send(getEndpoints(app));
});

//post thought to database
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  console.log(req.body);
  try {
    const newThought = await new Thought({
      message: message,
    }).save();

    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

//update likes on thought
app.post("/thoughts/:_id/like", async (req, res) => {
  const { _id } = req.params;
  try {
    const updateLikes = await Thought.findByIdAndUpdate(_id, {
      $inc: { hearts: 1 },
    });
    res.status(200).json({
      response: `Message ${updateLikes.message} has been updated with a like`,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

//show a maximum of 20 thoughts sorted on created date, in descending order
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false,
      message: "Could not fetch thoughts",
    });
  }
});

//Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
