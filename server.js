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

// Data model
const Thought = mongoose.model('Thought', {
  hearts: Number,
  message: String,
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// POST new thought
app.post('/thought', async (req, res) => {
 
    const newThought = new Thought({ message: req.body.message, hearts: 0 });
    await newThought.save();
 
    res.status(200).json(newThought)

})

// GET all thoughts
app.get("/thoughts", async (req,res) => {
    const thoughts = await Thought.find();
   res.status(200).json(thoughts)

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


//Get / thoughts: return at least 20 thoughts, sort by createdAt
//Post / thoughts: json body ({ "message": "Express is great!" })
// the thought should be saved, and the response should include the saved thought object, including its _id.
// Update thought's likes: POST thoughts/:thoughtId/like
