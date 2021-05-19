const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// specifying properties for the message, heart and createdAt
// Date.now, creating date at the moment whenit is creating 

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "message is required"],
    unique: true,
    trim: true, 
    validate: {
      validator: (value) => {
        return /^[^0-9]+$/.test(value);
      }
    },
    minlength: 5, 
    maxlength: 140
  },
  hearts: {
    type: Number, 
    default: 0
  },
  createdAt: {
    type: Date, 
    default: Date.now
  }
})

const Thought = mongoose.model('Thought', thoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// ROUTES
app.get('/', (req, res) => {
  res.send('Hello thought project')
})

// GET REQUEST
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

// POST REQUESTS
// By doing await new Thought({ message }).save()instead of saving the entire body it's
// only saving the message sent to the client other info will not be sent
// adds a layer of security

app.post('/thoughts', async (req, res) => {
  try {
    const { message } = req.body
    const newThought = await new Thought({ message }).save()
    res.json(newThought)
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "dublicated value", fields: error.keyValue })
    }
    res.status(400).json(error)
  }
})

// increasing amount of hearts (likes)
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params.thoughtId

  try { 
    const thoughtLiked = await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } });
    res.json(thoughtLiked);
  } catch (err) {
    res.status(400).json({ message: "Thought not found", error: err.errors });
  }
});

// delete end point
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  // find and delete 
  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id })
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: "not found" })
    }
  } catch {
    res.status(400).json({ message: "invalid request", error: "error" })
  }
})

// update entity "Patch", to replace, "Put" we can us findByIdAndReplace, and whole object ubdate
app.patch('thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findByIdAndUpdate(id, { name: 'req.body.name' }, { new: true })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: "not found" })
    }
  } catch {
    res.status(400).json({ message: "invalid request", error: "error" })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
