import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
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


const { Schema } = mongoose

const HappyThoughtSchema = new Schema({
  message: {
    // type is the most important one
    type: String,
    // required will be true or false, strongly recommended to use
    required: true,
    minlength: 5,
    maxlength: 140,
    // trim removes unnecessary white spaces from string
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const HappyThought = mongoose.model("HappyThought", HappyThoughtSchema)


// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

// GET - fetch data
// POST - create something
// PATCH - update
// PUT - replace
// DELETE - self-explanatory

// GET /thoughts endpoint
app.get("/thoughts", async (req, res) => {
  const happyThoughts = await HappyThought.find().sort({ createdAt: 'desc' }).limit(20)
  try {
    res.status(200).json({
      success: true,
      response: happyThoughts,
      message: "Happy thoughts found"
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      response: err,
      message: "Error, happy thoughts could not be found"
    })
  }
})

// POST /thoughts endpoint
app.post("/thoughts", async (req, res) => {
  const { message } = req.body
  try {
    const newHappyThought = await new HappyThought({ message }).save()
    res.status(201).json({
      success: true,
      response: newHappyThought,
      message: "New thought message successfully posted"
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      response: err,
      message: "Error, message could not be posted"
    })
  }
})

// GET /thoughts/:thoughtId endpoint
app.get("/thoughts/:thoughtId", async (req, res) => {
  const { thoughtId } = req.params
  try {
    const oneHappyThought = await HappyThought.findById(thoughtId)
    res.status(200).json({
      success: true,
      response: oneHappyThought,
      message: "Found the happy thought"
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      response: err,
      message: "Could not find that happy thought"
    })
  }
})

// Change to PATCH but change in the frontend too if you do
// POST thoughts/:thoughtId/like endpoint
// This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its `hearts` property to add one heart.
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params
  try {
    const newLike = await HappyThought.findByIdAndUpdate(thoughtId, { $inc: { hearts: 1 } }, { new: true })
    res.status(201).json({
      success: true,
      // response: {},
      response: newLike,
      message: "Updated hearts successfully"
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      response: err,
      message: "Error, could not update hearts"
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
