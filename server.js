// Requirements
// Your API should implement the routes exactly as documented in the instructions above
// Your GET /thoughts endpoint should only return 20 results, ordered by createdAt in descending order.
// Your API should validate user input and return appropriate errors if the input is invalid.
// In the POST /thoughts endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to 400 (bad request).
// The endpoint to add hearts to a thought should return an appropriate error if the thought was not found.

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//------The Thought model------//
// message is required, min length 5 chars, max length 140 chars
//hearts defaults to 0, should not be assignable when creating a new thought
// For example, if I send a POST request to / to create a new thought with this JSON body; { "message": "Hello", "hearts": 9000 }, then the hearts property should be ignored, and the object we store in mongo should have 0 hearts.
//createdAt defaults to current time, not assignable when creating a new thought

const Thought = mongoose.model("Thought", {
  message: String,
  hearts: Number,
  createdAt: {
    type: Date,
    default: () => new Date(),
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
  res.send(listEndpoints(app));
});

//----- GET/thoughts ------//
// This endpoint should return a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().limit(20);
  //.sort({createdAt: "des"})
  if (thoughts) {
    res.json(thoughts);
  } else {
    res.status(404).json({ error: `No thoughts found` });
  }
});

//----- POST/thoughts ------//
// This endpoint expects a JSON body with the thought message, like this: { "message": "Express is great!" }. If the input is valid (more on that below), the thought should be saved, and the response should include the saved thought object, including its _id.
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const thought = new Thought({ message });
  await thought.save();
  res.json(thought);
});
//ADD ERROR HANDLING ABOVE! but it works right now!

//----- POST/thoughts/:thoughtId/like ------//
// This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its hearts property to add one heart.

// app.get("/thoughts/:_id", async (req, res) => {
//   const tId = req.params._id;
//   const foundThought = await Thought.findById(tId);
//   if (foundThought) {
//     res.json({ body: foundThought });
//   } else {
//     res.status(404).json({ error: `No thought matching that id found` });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
