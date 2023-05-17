import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const { Schema } = mongoose;
const ThoughtSchema = new Schema({

  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now, // versus new Date?
    readOnly: true // need to be non assignable - fix 
  }

})


const Thought = mongoose.model("Thought", ThoughtSchema);

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
const listEndpoints = require("express-list-endpoints")


// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

// GET - fetch latest 20 thoughts 
app.get('/thoughts', async (req, res) => {
  try{
    const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec(); //execute
    res.status(200).json({
      success: true,
      response: thoughts,
      message: "Thoughts retreived"
  })
} catch (err) {
    res.status(400).json({
      success: false,
      response: err,
      message: "Error, no thoughts found"
  })
}
})

// POST - post a new thought 
app.post('/thoughts', async (req, res) => {
  const { message, createdAt } = req.body;
  const thoughts = new Thought({ message, createdAt, hearts: 0 }); // hearts always 0, but can still update using patch request 
  try {
    const savedThought = await thoughts.save();
    res.status(201).json(savedThought);
  }
  catch(err) {
    res.status(400).json({
      message: "Could not save thought to the database", error: err.errors
    })
  };
})

// PATCH thoughts/:thoughtId/like - get a heart like on a thought 
app.patch('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const thought = await Thought.findById(thoughtId);
    if (thought) {
      thought.hearts += 1;
      const updatedThought = await thought.save();
      res.status(200).json({
        success: true,
        response: updatedThought,
        message: `Thought ${ updatedThought.id} added heart successfully`
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Thought not found"
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      response: err,
      message: "Error occured"
    });
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});