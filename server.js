import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return !/^\S{31,}$/.test(value)
      },
      message: "Message contains too long words. Please use max 30 characters per word."
    },
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
  },
})

const Thought = mongoose.model('Thought', thoughtSchema)

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send({ message: "See file docs.md for list of endpoints and their uses <3"})
})

app.get('/thoughts', async (req, res) => {
  const allThoughts = await Thought.find().sort({ createdAt: -1 }).limit(20)
  res.json(allThoughts)
})

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({
      message: req.body.message,
    }).save()
    res.send(newThought)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id }, { useFindAndModify: true })
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: "Not found" })
    }
  } catch (error){
    res.status(400).json({ message: "Invalid request", error})
  }
})

app.put('/thoughts/:id', async (req, res) => {
  const { id } = req.params
  try {
    const updatedThought = await Thought.findOneAndReplace({ _id: id }, { message: req.body.message }, { new: true })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: "Not found" })
    }
  } catch (error){
    res.status(400).json({ message: "Invalid request", error})
  }
})

app.post('/thoughts/:id/likes', async (req, res) => { //post request instead of patch as to fit the already developed frontend
  const { id } = req.params
  try {
    const updatedThought = await Thought.findByIdAndUpdate( id, { $inc: { hearts: 1} }, { new: true })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: "Not found" })
    }
  } catch (error){
    res.status(400).json({ message: "Invalid request", error})
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
