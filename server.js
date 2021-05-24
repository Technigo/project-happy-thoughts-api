import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const thoughtSchema = new mongoose.Schema({
  message: {
    type:String,
    required:true,
    unique:true
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

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Happy thoughts')
})

//Creating a new thought based on our model
app.post('/thoughts', async (req, res) => {
  try {
  const newThought = await new Thought(req.body).save()
  res.json(newThought)
  } catch (error) {
    res.status(400).json(error)
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
