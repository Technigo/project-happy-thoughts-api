import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;



// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 9000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Thoughts schema
const ThoughtsSchema = new mongoose.Schema({
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
  },
  username: {
    type: String,
    default: "Anonymous",
    minlength: 2,
    maxlength: 20,
  },
  tag: {
    type: [String],
    default: ["general"],
  }
});

// Model
const Thought = mongoose.model("Thought", ThoughtsSchema);


// Routes
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    Welcome: "Welcome to the Happy Thoughts APP",
    Routes: listEndpoints(app)
  });
});


// Get all thoughts
app.get("/thoughts", async (req, res) => {
  //add pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
 
  if (thoughts) {

   res.status(200).json(thoughts)
  } else {
   res.status(404).json({
     message: 'It was not possible to find thoughts', error: err.errors
   })
  }
 })

//Create new thought
app.post("/thoughts", async (req, res) => {;
  // req.body to access the thing we send in the post request
  const {message} = req.body
  try {
    const newThought = await new Thought({message: message}).save();
    res.status(201).json({success: true, response: newThought})
  } catch(error) {
    res.status(400).json({success: false, response: error})
  }
});

// Update the like count on each thought
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params; 
  try {
    const thoughtToUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}}, { new: true }); 
    res.status(200).json({success: true, response: `Thought ${thoughtToUpdate.id} was liked!`})
  }
  catch (error) {
    res.status(400).json({success: false, response: error});
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
