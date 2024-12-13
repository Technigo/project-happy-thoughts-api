import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { Thought } from "./thought"; // Adjust the path as needed

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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

// Root route for testing
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Routes
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20); // Fetch recent 20 thoughts
    res.status(200).json(thoughts); // Return the thoughts as JSON
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve thoughts" }); // Handle errors
  }
});

app.get("/test-save-thought", async (req, res) => {
  try {
    // Create a sample thought
    const sampleThought = new Thought({
      message: "This is a sample happy thought!",
    });

    // Save it to the database
    const savedThought = await sampleThought.save();

    // Return the saved thought as a response
    res.status(201).json(savedThought);
  } catch (error) {
    // Handle errors
    res.status(400).json({ error: error.message });
  }
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  // Input validation
  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({ error: "Message must be between 5 and 140 characters" });
  }

  try {
    const newThought = new Thought({ message }); // Only save the message field
    const savedThought = await newThought.save();
    res.status(201).json(savedThought); // Return the saved thought
  } catch (error) {
    res.status(500).json({ error: "Could not save thought" }); // Handle errors
  }
});

//POST /thoughts/:thoughtId/like
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } }, // Increment the hearts by 1
      { new: true } // Return the updated document
    );

    if (!updatedThought) {
      return res.status(404).json({ error: "Thought not found" }); // Handle case where thought is not found
    }

    res.status(200).json(updatedThought); // Return the updated thought
  } catch (error) {
    res.status(500).json({ error: "Could not update hearts" }); // Handle errors
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
