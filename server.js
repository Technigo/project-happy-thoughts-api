import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

//const mongoUrl = "mongodb+srv://dbUser:dbUserOlofTechnigo@cluster0.x2ofn.mongodb.net/projectHappy?retryWrites=true&w=majority"
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//mongoose model
const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Olofs Project Happy thoughts API. Endpoints /thoughts (GET), /thoughts (POST), /thoughts/:thoughtid/like (POST)");
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().limit(20).sort("-createdAt");
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  try {
    const thought = await new Thought({ message: req.body.message }).save();
    res.status(200).json(thought);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Could not save thought", errors: err.errors });
  }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  console.log(req.params);
  const { thoughtId } = req.params;
  console.log(thoughtId);
  try {
    await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } });
    res.status(201).json();
  } catch (err) {
    res
      .status(400)
      .json({ message: "Could not like a thought that doesn't exist", errors: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
