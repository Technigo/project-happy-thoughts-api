import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose' 

const mongoUrl = process.env.MONGO_URL || "mongodb+srv://tuttibalutti:RZhL2GP40uxXsqaM@cluster0.le3iv.mongodb.net/happy-thoughts-finder?retryWrites=true&w=majority"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

// Defines the port the app will run on
const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 140,
    trim: true
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

const Thought = mongoose.model('Thought', thoughtSchema)

// Middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res) => {
  const allThoughts = await Thought.find().sort({ createdAt: -1 }).limit(20)
  res.json(allThoughts)
})

app.post('/thoughts', async (req, res) => {
  try {
  const newThought = await new Thought({ message: req.body.message }).save()
  res.json(newThought)
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "This message already exists", fields: error.keyValue })
    }
    res.status(400).json(error)
  }
})

app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params
  console.log(id)
  try {
    const updatedThought = await Thought.findOneAndUpdate({ _id: id }, { $inc: { hearts: 1 } }, { new: true })
    console.log(updatedThought.id)
    if (updatedThought) {
      res.json(updatedThought)
    }
  } catch (error) {
    res.status(404).json({ message: 'Thought not found' })
  }
})

app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedThought = await Thought.findByIdAndDelete(id)
    if (deletedThought){
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: 'Thought not found' })
    }  
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
