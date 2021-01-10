import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true, 
    minLength: 5,
    maxLength: 140,
  },
  username: {
    type: String, 
    maxLength: 20,
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

app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

app.post('/', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({message})
   console.log(thought)
   try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
    } catch (err) {
    res.status(400).json({ message: 'Could not save thought', error: err})
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const {thoughtId} = req.params
  const like = await Thought.findById(thoughtId)
  
  if(like) {
    like.hearts += 1
    like.save()
    res.json(like)
  } else {
    res.status(404).json({message: 'Could not find happy thought', error: err.errors})
  }
  })

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })