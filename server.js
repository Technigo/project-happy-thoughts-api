import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { process_params } from "express/lib/router";
import res from "express/lib/response";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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
  res.send("Think happy thoughts, think happy thoughts");
});
//////////////////
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: (() => new Date())()
  }
})

const Thought = mongoose.model("Thought", ThoughtSchema);

// Get 20 of the latest thoughts added
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find({}).sort({ createdAt: 'desc' }).limit(20).exec()
      res.status(200).json(thoughts);
  } catch(error) {
    res.status(400).json({success: false, response: "Error, couldn't find what you where looking for." });
  }
})

// Posting a new message
app.post("/thoughts", async(req, res) => {
  const { message } = req.body;
  try{
    const newThought = await new Thought({ message: message }).save();
    res.status(201).json({ success: true, response: newThought });
  } catch (error) {
    res.status(400).json({success: false, response: "Error, couldn't find what you where looking for." });
  }
})

//Updating likes
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const thoughtToUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: { hearts: 1 }});
    res.status(200).json({success: true, response: `Thought ${thoughtToUpdate.id} got a new heart`});
  } catch (error) {
    res.status(400).json({success: false, response: error });
  }
})
//////////////////

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});