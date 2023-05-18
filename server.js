import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/HappyT";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// This defines the model for the tasks
// model is a blueprint for the data
const Thought = mongoose.model("Thought", {
  // object with key value pairs
  message: {
    type: String,
    required: true,
    default: "",
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
  res.send("Hello Mr Bond! I've been expecting you!");
});

// A endpoint to create a task
// async await is a way to handle promises
// req = request, res = response - means: when someone makes a request to this endpoint, send back a response
// get= gets the data.
// post = posts & saves the data




// A GET ENDPOINT (to get all thoughts)
// get och post= methods
// enpoint= /thoughts
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec(); 
  res.json(thoughts);
});

// app.get('/thoughts/:thoughtId', async (req, res) => {
//   const { thoughtId } = req.params;
//   const thought = await Thought.findById(
//     { _id: thoughtId }
//   );
//   res.json(thought);
// });


// A POST ENDPOINT 
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $inc: { heart: 1 } },
      { new: true }
    );
    res.status(201).json(updatedThought);
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought to the database', error: err.errors });
  }
});

// A POST ENDPPINT (to create a thought)
app.post('/thoughts', async (req, res) => {
  // Retrieve the information sent by the client to our API endpoint
 const {message, heart} = req.body; 
// use our mongoose model to create the database entry
 const thought = new Thought({message, heart});

  try { 
    // success case
    const savedThought = await thought.save();
    console.log('id', req.params);
    res.status(201).json(savedThought);
  } catch (err) { 
    res.status(400).json({ message: 'Could not save thought to the database', error: err.errors });  
    }
});






// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
