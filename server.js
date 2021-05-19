/* eslint-disable max-len */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { json } from 'body-parser'
import dotenv from 'dotenv'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
// eslint-disable-next-line max-len
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String, 
    required: [true, "Oh you silly, msg is required"],
    unique: true,
    // enum: ['Technigo is cool','Technigo is awesome','Technigo was the time of my life']
    // match: /^[^0-9]+$/, 
    validate: {      
      validator: (value) => {
        return /^[^0-9]+$/.test(value)
      },
      message: "Numbers are not allowed"
    },
    minlength: 5,
    maxlength: 10
  },   
  hearts: {
    type: Number,
    default: 0
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  }  
})

const Thought = mongoose.model('Thought', thoughtSchema)

if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Thought.deleteMany({})    
  }
  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res) => {  
  const allThoughts = await Thought.find().sort({ CreatedAt: -1 }).limit(20)
  res.json(allThoughts)
})

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({ message: req.body.message }).save()
    res.json(newThought)
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Duplicated value', fields: error.keyValue })
    }
    res.status(400).json(error)
  }
})

app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    // v1 - only delete
    const deletedThought = await Thought.deleteOne({ _id: id })
    res.json(deletedThought)

    // v2 - find n delete
  //   const deletedThought = await Thought.findOneAndDelete({ _id: id })
  //   if (deletedThought) {
  //     res.json(deletedThought)
  //   } else {
  //     res.status(404).json({ message: "Thought not found" })
  //   }
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error })
  }
})

app.patch('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findByIdAndUpdate(id, { message: req.body.message, hearts: +1 })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }    
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

app.post('/thoughts/:id/likes', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findByIdAndUpdate(id, { $inc: { hearts: 1 } })
    res.json(updatedThought)
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
