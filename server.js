import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thougts";

// OLD --> "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtsSchema = mongoose.Schema({
message: {
  type: String,
  required: true,
  minlength: 5,
  maxlength: 140,
  trim: true
},
hearts: {
  type: Number,
  default: 0,
},

createdAt: {
  type: Date,
  default: () => new Date()
}
})

const Thought = mongoose.model("Thought", ThoughtsSchema)

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
  res.send("This is my API for the project Happy Thoughts, view it live at https://steady-faun-1238b0.netlify.app");
});


// POST => create stuff
// PUT => repacing something in the DB --> for example: one person switch with another
// PATCH => change / modify stuff

// ENDPOINT 1: RETURNING THE THOUGHTS
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20);
    res.json(thoughts);
  } catch (err) {
    res.status(400).json({
      message: "Could not find this post",
      response: err.errors,
      success: false,
    });
  }
});

// ENDPOINT 2: POSTING THOUGHTS
app.post("/thoughts", async (req, res) => {
  const { message } = req.body
  // console.log(req.body)
  try {
    const newThought =  await new Thought({ message }).save()
    res.status(201).json({success: true, response: newThought})
  } catch(err){
    res.status(400).json({
      message: "Could not post this thought",
      response: err.errors,
      success: false,
    });
  }
})

// ENDPOINT 3: LIKEING THOUGHTS
app.patch("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const likedThought = await Thought.findByIdAndUpdate(id, {
      $inc: { hearts: 1 },
    });
    res.status(200).json({success: true, response:`It's working! The post got ${likedThought.hearts} likes`});
  } catch (err) {
    res.status(400).json({
      message: "Could not find and update this post",
      response: err.errors,
      success: false,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
