import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { Thought } from "./models/thoughtModel.js";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 8000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Send me a good thought");
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();

  res.json(thoughts);
});

// // Routes to add new Thought
// app.post("/thoughts", async (req, res) => {
//   const { message } = req.body;
//   const thought = new Thought({ message });

//   try {
//     const savedThought = await thought.save();
//     res.status(200).json(savedThought);
//   } catch (err) {
//     res
//       .status(400)
//       .json({ message: "No new thought was created", err: err.errors });
//   }
// });

// app.get("/thoughts/:thoughtId/like", async (req, res) => {
//   // FInd the heart and update its value by one
//   const { thoughtId } = req.params;

//   try {
//     const thought = await Thought.findById(thoughtId);

//     if (!thought) {
//       return res.status(404).json({ message: "Thought not found" });
//     }

//     // Update hearts for each like
//     thought.hearts += 1;

//     const updateThought = await thought.save();

//     return res.status(200).json(updateThought);
//   } catch (err) {
//     res.status(400).json({ message: "No thought was found", err: err.errors });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
