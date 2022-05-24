import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-tweet";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());


//mongoose schema
const ThoughtSchema = new mongoose.Schema({

  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true,
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


//thought model
const Thought = mongoose.model("Thought", ThoughtSchema);


//landing page
app.get("/", (req, res) => {
  res.send("This is the API for Happy Tweets!");
});


//Mongoose GET request
app.get("/thoughts", async (req, res) => {
  const { page } = req.query;

  try {
    const thoughts = await Thought.find({}).sort({createdAt: -1})
      .skip((page - 1) * 20).limit(20);
    res.status(200).json({success: true, response: thoughts});
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }

});


//POST request 
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  
  try {
    const newThought = await new Thought({message: message}).save()
    res.status(201).json({response: newThought, success: true});
  } catch(error) {
    res.status(400).json({response: "could not post thought", success: false});
  }

});


//likes
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId} = req.params;
  
  try {
    const likeToUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
    res.status(200).json({response: `Thought ${likeToUpdate.hearts} has gotten a like`, success: true});
  } catch (error) {
    res.status(400).json({response: "could not like thought", success: false});
  }

});


//delete - saving this for future changes to the app
app.delete("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  
  try{
    const deleted = await Thought.findOneAndDelete({_id: id});
    if(deleted) {
      res.status(200).json({success: true, response: deleted});
    } else {
      res.status(404).json({success: false, response: "thought not found"});
    }
  } catch (error) {
    res.status(400).json({success: false, response: "could not delete thought"});
  }

});


//update
app.patch("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  const { updatedThought } = req.body;

  try {
    const ThoughtToUpdate = await Thought.findByIdAndUpdate({_id: id}, {hearts: updatedThought});
    if(ThoughtToUpdate) {
      res.status(200).json({success: true, response: ThoughtToUpdate});
    } else {
      res.status(404).json({success: false, response: "thought not found"});
    }
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }

});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
