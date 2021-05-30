import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const userDB = process.env.userDB;
const passDB = process.env.passDB;

// This is the local host DB url
// mongodb://localhost/happyThoughts
const mongoUrl =
  process.env.MONGO_URL ||
  `mongodb+srv://${userDB}:${passDB}@cluster0.sg0yi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const schema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  heart: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Thoughts = mongoose.model("Thoughts", schema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(
    "You can view the 20 latest thoughts with a get request on /thoughts. You can like a post on /thoughts/_id/like. You can post a new thought with a post request on /thoughts with the body { message: `New post`}"
  );
});

app.get("/thoughts", async (req, res) => {
  // This get request should return a maximun of 20 thoughts sorted by createdAt
  // to show the most recent thoughts first
  try {
    const thoughts = await Thoughts.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.json(thoughts);
  } catch (error) {
    res.status(400).json({
      message: "Could not fetch the list of thoughts.",
      error: error.errors,
    });
  }
});

app.post("/thoughts", async (req, res) => {
  try {
    const newThought = await new Thoughts(req.body).save();
    res.status(200).json({ message: "Your post was submitted" });
  } catch (error) {
    res.status(400).json({ error: "Failed to send post." });
  }
});

app.post("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const likes = await Thoughts.updateOne({ _id: id }, { $inc: { heart: 1 } });
    res.json(likes);
  } catch (err) {
    res.status(400).json({ message: "Invalid request", error: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
