import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const port = process.env.PORT || 8080
const app = express()


app.use(cors())
app.use(express.json())


const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true,
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


const Thought = mongoose.model('Thought', thoughtSchema);


app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
  })

app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })
    
  try {
  const newThought = await thought.save()
  res.status(201).json(thought)
  } catch (err) {
  res.status(400).json({message: 'Could not save your thought to the database', error: err.errors})
  } 
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
