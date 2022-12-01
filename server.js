import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtSchema = new mongoose.Schema ({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
    // default: () => new Date()
  }
});

const Thought = mongoose.model("Thought", ThoughtSchema);

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
  res.send({
    Welcome: 
    "Welcome to this Happy thoughts API.❤️",
    Routes: [
      { 
        "/thoughts": "Show all posted happy thoughts",
      }
    ],
  });
});

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts);
});

app.post('/thoughts', async (req, res) => {
  const {message} = req.body;
  try {
    const newThought = await new Thought({message: message}).save();
    res.status(201).json({success: true, response: newThought});
  } catch(error) {
    res.status(400).json({success: false, response: error});
  }
});

/* app.post('/thoughts', async (req, res) => {
  // Retrieve the information sent by the client to our API endpoint
  const {message} = req.body;

  // Use our mongoose model to create the database entry
  const thought = new Thought({message});

  try {
    // Success
    const newThought = await thought.save();
    res.status(201).json(newThought);
  } catch (err) {
    res.status(400).json({message: 'Could not save thought to the Database', error: err.errors});
  }
}); */

// PATCH => change/modify stuff
app.patch("thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
   const thoughtToUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
   res.status(200).json({sucess: true, response: `Thought ${thoughtToUpdate.id} was liked!`})
  } catch (error) {
   res.status(400).json({success: false, response: error});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
