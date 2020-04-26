import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise
//to be able to use findOneAnd Update this needs to be false
mongoose.set('useFindAndModify', false);

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  heart: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})


const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


app.get('/', async (req, res) => {
  const thought = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thought)
})

app.post('/', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save your thought', error: err.errors })
  }
})

// ****this endpoint updates the number of hearts/likes 
app.post('/:id/like', async (req, res) => {
  try {
    const like = await Thought.findOneAndUpdate(
      { "_id": req.params.id }, //filters & is required
      { $inc: { "heart": 1 } }, //updates & is required
      { new: true } //updates the number of hearts in POST
    )
    res.status(201).json(like)
  } catch (err) {
    res.status(400).json({ message: 'Could not save your like', error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
