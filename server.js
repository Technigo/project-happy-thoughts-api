import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thoughts'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


// PORT
const port = process.env.PORT || 8080
const app = express()

// MIDDLEWARES
app.use(cors())
app.use(bodyParser.json())

// ROUTES
app.get('/', (req, res) => {
  res.send('Happy thoughts')
})

// All thoughts 
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

// Post new thought
app.post('/thoughts', async (req, res) => {
  const {message} = req.body
  const thought = new Thought ({message})
  try{
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  }catch (err){
    res.status(400).json({ message: 'Could not save thought to database', error:err.errors })
  }
})

// Post a heart (like) to thought
app.post('/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try{
    const likeThought = await Thought.updateOne(
      { _id: thoughtId }, 
      { $inc: { hearts: 1} }
    )
    res.status(201).json(likeThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not find Id to update', error:err.errors})
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
