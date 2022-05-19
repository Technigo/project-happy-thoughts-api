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
const ThoughtSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: false
  },
  hearts: {
    type: Number,
    minimum: 0,
    default: 0,
    exclusiveMinimum: false
  },
  message: {
    type: String,
    minlength: 5, 
    maxlength: 140,
    trim: true,
    required: true
  },
  tags: {
    type: String,
    enum: ['Food', 'Dating', 'Project', 'Friends', 'Random']
  },
  createdAt: {
    type: Date,
    //Add a anonymous function before new Date to return the date when the thought is created
    // Without the anonymous function, it will only return the date the application is created
    default: () => new Date()
  }
})

const Thought = mongoose.model( 'Thought', ThoughtSchema )

// Main routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// POST new thought
app.post('/thought', async (req, res) => {
 
    const { name, message, tags } = req.body

    try {

      const newThought = new Thought({ name: name, message: message, tags: tags});
     
      await newThought.save()

      res.status(201).json({ response: data, success:true })
    } 
    catch (error) {
          res.status(400).json({ res: error, success: false })
    }
 
})

// GET all thoughts
app.get("/thoughts", async (req,res) => {
  const thoughts = await Thought.find();
   res.status(200).json(thoughts)

})

// Increase number of likes / hearts
app.post('/thoughts/:id/hearts', async (req, res) => {
 
  const { id } = req.params;
  
  try { 
    const updateThought = await Thought.findByIdAndUpdate(id, { $inc: { hearts: 1 } });
    res.json(updateThought)
  } catch (error) {
    res.status(400).json({res: error})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


//Get / thoughts: return at least 20 thoughts, sort by createdAt
//Post / thoughts: json body ({ "message": "Express is great!" })
// the thought should be saved, and the response should include the saved thought object, including its _id.
// Update thought's likes: POST thoughts/:thoughtId/like
