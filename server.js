import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  } ,
  hearts: {
    type: Number, 
    default: 0
  } ,
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/thoughts', async (req, res) => {
  const thougths = await Thought.find().sort({createdAt: 'desc' }).limit(20).exec()  
  res.json(thougths)
})

app.post('/thoughts', async (req, res) => {
  const { message } = req.body 
  const thought = new Thought({ message })

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
  res.status(400).json({ message: 'could not post happy thought', errors:err.errors})
 }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const thoughtId = req.params.thoughtId

  try {
    const thoughtLiked = await Thought.updateOne({ _id: thoughtId }, { $inc : { hearts : 1 }})
    res.json(thoughtLiked)
  } catch (err) {
    res.status(400).json({ message: " Thought not found" , error:err.errors})
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
