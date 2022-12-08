import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// The schema has properties. It will requier the user to provide the properties with the 
// given restrictions.
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

const Thought = mongoose.model("Thought", ThoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.json({ 
    Message: "Welcome to Happy Thoughts",
    Routes: {
      "/thoughts": "Is to GET and POST Thouhgts",
      "/thoughts/:id/like": "a PATCH that will add Hearts to the Happy Thoughts"
    }
  });
});

app.get("/thoughts", async (req, res) => {
  try {
    const allThoughts = await Thought.find().limit(20).sort({ createdAt: 'desc' });
    res.status(201).json(allThoughts);
  } catch(error) {
      res.status(400).json({ error: 'Could not get messages'});
  }
});
// Will add users new messages in the database
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const newThought = await new Thought({message: message}).save();
    res.status(201).json({
      success: true, 
      response: newThought
    });
  } catch(error) {
    res.status(400).json({
      success: false, 
      response: 'Could not post new thought'});
  }
});
// PATCH => changes/modifys things 
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
   const { id } = req.params;
   try {
    const heartsToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}});
    res.status(200).json({
      success: true, 
      response: `Thought ${heartsToUpdate.thought} has their hearts updated`});
   } catch (error) {
    res.status(400).json({
      success: false, 
      response: 'Could not updated thought'});
   }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
