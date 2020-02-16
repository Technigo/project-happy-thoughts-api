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

const port = process.env.PORT || 8080
const app = express()


app.use(cors())
app.use(bodyParser.json())

app.get('/', async(req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(thoughts);
})

app.get('/:thoughtId', async(req, res) => {
  const thoughtId = req.params.thoughtId
  Thought.findOne({ '_id': thoughtId })
    .then((result) => {
      res.json(result)
    })
})

app.post('/', async(req, res) => {
  const thought = new Thought({
    message: req.body.message,
    hearts: 0
  })
  try {
    const saved = await thought.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought', errors: err.errors })
  }
});


app.post('/:id/like', async(req, res) => {
  try {
    const thought = await Thought.updateOne({ _id: req.params.id }, { $inc: { hearts: 1 } }, { new: true })
    res.status(200).json(thought)
  } catch (err) {
    res.status(400).json({ message: 'Could not add heart', errors: err.errors })
  }
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})