import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

//Creating thought schema with three properties
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Message is required!'],
    unique: true,
    trim: true,
    minlength: [5, 'Your thought is too short'],
    maxlength: [140, 'Your thought is too long']
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now // same as () => Date.now()
  }
})

//Creating single Thought model 
const Thought = mongoose.model('Thought', thoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())


app.get('/thoughts', (req, res) => {
  res.send('Hello world')
})

app.post('/thoughts', async (req, res) => {
  try {
    //Creating a new Thought
    const newThought = await new Thought(req.body).save()// same as ({ message: req.body.message })
    res.json(newThought)
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Duplicated value', fields: error.keyValue })
    } 
    res.status(400).json(error)
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
