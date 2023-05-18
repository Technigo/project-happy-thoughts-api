import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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
    Routes: [{
      "/thoughts": "All the Happy thoughts!"
    }]
  });
});


// Get all thoughts
app.get("/thoughts", async (req, res) => {
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
app.post("/thoughts", async (req, res) => {
  const {message} = req.body;
  try {
    const newThought = await new Thought({message: message}).save();
    res.status(201).json({success: true, response: newThought})
  } catch(error) {
    res.status(400).json({success: false, response: error})
  }
});

// Update the like count on each thought


// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
