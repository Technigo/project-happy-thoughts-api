import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb+srv://jenquach:Koda2022@cluster0.d5xuu.mongodb.net/happyThoughts?retryWrites=true&w=majority"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
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
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },  
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Thought = mongoose.model('Thought', ThoughtSchema)

new Thought({message: "happy if this works!"}).save()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

//--ROUTES--

// Main endpoint
app.get('/', (req, res) => {
  res.send('Welcome to Happy thougths API')
})

// List of all the endpoints
app.get('/endpoints', (req, res) => {
  res.send(listEndpoints(app))
})

// Endpoint to get thoughts with a limit of the most recent 20 thoughts
app.get('/thoughts', async (req, res) => {
  try {
    const allThoughts = await Thought.find()
      .sort({ createdAt: 'desc' })
      .limit(20)
      .exec()
    res.json(allThoughts)
  } catch (err) {
    res.status(400).json({ message: 'No thoughts found', error: err.error})
  }
})

// Endpoint to post new thoughts
app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const thought = await new Thought(req.body).save()
    res.status(201).json({ response: thought, success: true })
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought', errors: err.errors})
  }
})

// Endpoint to increase likes
app.post('/thoughts/:thoughtId/like', async (req, res) => {
 const { thoughtId } = req.params

 try {
  const updatedThought = await Thought.findByIdAndUpdate(thoughtId, { 
    $inc: { 
      heart: 1 
    }
  },
  {
    new: true,
  })
  res.status(201).json({ response: updatedThought, success: true})
 } catch (err) {
   res.status(400).json({ message: 'Could not update thought', errors: err.errors })
 }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
