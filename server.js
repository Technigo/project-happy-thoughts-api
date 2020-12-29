import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = new mongoose.model('Thought', {
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

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

app.post('/thoughts', async (req, res) => {
  const {message} = req.body
  const thoughts = new Thought({message})

  try {
    const saveThought = await thoughts.save()
    res.status(201).json(saveThought)
  } catch (err) {
    res.status(400).json({message: 'could not save task to db', error:err.errors})
  }
})

app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params
  const findThought = await Thought.findOne({_id: id})

  if (findThought) {
    await Thought.updateOne({_id: id}, {$inc : {hearts: 1}})
    res.status(201).json({message: `added like to ${id}`})
  } else {
    res.status(400).json({message: "can not find thought"})
  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
