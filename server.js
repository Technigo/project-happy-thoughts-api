import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define how the structure of the data will be:
const ThoughtSchema = new mongoose.Schema({
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
    default: () => new Date()
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
// Check if connection to database is ok: 

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Getting all current thoughts stored in the database
app.get("/thoughts", async (req, res) => {
  try {
    const allThoughts = await Thought.find().sort({ createdAt: 'desc' });
    res.status(201).json(allThoughts);
  } catch(error) {
      res.status(400).json({ error: 'Could not get messages'});
  }
  
});

// Adding users messages to the database via API
app.post("/thoughts", async (req, res) => {
  try {
    const newThought = new Thought({ message: req.body.message })
    await newThought.save()
    res.status(201).json(newThought)
  } catch(error) {
      res.status(400).json({ error: 'Could not post message'});
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
