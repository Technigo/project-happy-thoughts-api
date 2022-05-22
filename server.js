import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happyThoughtsApi";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();


const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
    // type: Date,
    // default: () => new Date()
  }
})

const Thought = mongoose.model("Thought", ThoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app))
})


// get all thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({createdAt: "desc"}).limit(20).exec()
  res.status(200).json({
    response: thoughts,
    success: true
  })
} catch(err) {
  res.status(400).json({
    error: "Invalid request",
    success: false
  })
}
})


// send a new thought to the api
app.post("/thoughts", async (req, res) => {
  try {
    const { message } = req.body
    const thought = await new Thought({ message }).save()
    res.status(201).json(thought)
  } catch(err) {
    res.status(400).json({
      error: "Sorry, could not save thought",
      success: false
    })
  }
})


// increase the likes on a specific thought
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const { thoughtId } = req.params
    const likedThought = await Thought.findByIdAndUpdate(thoughtId, {
      $inc:{ 
        hearts: 1 
      }
    },
    {
      new: true
    })
    res.status(201).json({
      response: likedThought,
      success: true
    })
  } catch(err) {
    res.status(400).json({
      error: "Sorry, could not send like",
      success: false
    })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
