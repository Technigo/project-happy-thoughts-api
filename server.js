import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise
 
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())
const Thought = new mongoose.model('Thought', {
  message: {
    type: String,
    required: [true, "A message is required"],
    minlength: [5, "Minmum nr of characters are 5"],
    maxlength: [140, "Maximum nr of characters are 140"]
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

//Middleware to handle connections errors
app.use((req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      next()
    } else {
      res.status(503).json({ error: 'Service unavailable' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error! Could not access the server.' });
  }
})

// Endpoints

app.get('/', (req, res) => {
  res.send('This is an API for "Happy Thoughts"')
})

// Endpoint to get the list the 20 latest thoughts
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

// Endpoint to post a thought to the database
app.post('/thoughts', async (req, res) => {
  
  
  try {
    const thought = new Thought({ message: req.body.message  })
    const savedThought = await thought.save()
    res.status(200).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought to the database', error: err.errors })
  }
})

app.post('/thoughts/:id/like', async (req, res) => {
  try {
    const updateThought = await Thought.updateOne({ _id: req.params.id }, { $inc: { 'hearts': 1 } } )
    res.status(201).json(updateThought)
  } catch (err) {
    res.status(404).json({ message: 'Could not like the thought, since it was not found.', error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
