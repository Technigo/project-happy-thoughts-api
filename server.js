import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "MONGO_URL"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const ThoughtSchema = new mongoose.Schema({
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
    type: Number,
    default: () => Date.now()
  }
})

const Thought = mongoose.model('Thought', ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())


// Endpoints:
app.get("/", (req, res) => {
  res.json({
    message:
      "View all thoughts at http:",
  });
});

// return 20 latest thoughts ({}?)
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc'}).limit(20).exec();
  res.status(200).json({ response: thoughts, success: true });
});


// post thought
app.post('/thoughts', async (req, res) => {
  // Retrieve the information sent by client to API endpoint
  const { message } = req.body;

  // Use mongoose schedule to create the database entry
  const thought = new Thought({ message });

  try {
    // success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
    //if something goes wrong (doesn't match the schema)
  } catch (err) {
    res.status(400).json({message: 'Could not save thought to the database', error: err.errors});
  }
});

// Uppdating amount of hearts:
app.post("/thoughts/:id/hearts", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      {
        $inc: { hearts: 1 },
      },
      { new: true }
    );
    res.status(200).json(updatedThought);
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

