import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  heart: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    Default: Date.now
  }
});
// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 9090;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

console.log("Resetting database!"); //Use this command in terminal RESET_DATABASE=true npm run dev

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/thoughts", async (req, res) => {
  const thought = await Thought.find()
    .sort({ createdAt: "desc", heart: +1 })
    .limit(20)
    .exec();
  res.json(thought);
});

app.post("/thoughts", async (req, res) => {
  //  retrieve information sent by the client to the api
  const { message } = req.body;
  //use mongoose model to create the database entry
  const thoughts = new Thought({ message });

  try {
    // success case
    const savedThought = await thoughts.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({
      message: "Could not save your thought to Database",
      error: err.errors
    });
  }
});

app.post("/:id/like", async (req, res) => {
  // this endpoint should update the Number of hearts

  try {
    const like = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { heart: 1 } },
      { new: true }
    );
    res.status(201).json(like);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Could not save your like", error: err });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
