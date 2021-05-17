import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

dotenv.config()

// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/happyThoughts"
const mongoUrl = process.env.MONGO_URL || `mongodb+srv://${process.env.USER_ID}:${process.env.API_KEY}@cluster0.bvwog.mongodb.net/happyThoughts?retryWrites=true&w=majority`
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8081
const app = express()

const thoughtSchema = new mongoose.Schema({
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
    default: Date.now
  }
})

//Create model for mongo database 
const Thought = mongoose.model('Thought', thoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints)
})
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought ({
      message: req.body}).save() 
      res.status(201).json(newThought)
  } catch(error) {
  res.status(400).json({ message: 'Could not save message', errors: error.errors})
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

