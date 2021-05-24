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
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator:(value) => {
        return /^[^0-9]+$/.test(value)
      },
      message: "Numbers are not allowed. Try again, please."
    },
    minlength: 5,
    maxlength:140
    /* minlength: {
      value: 5,
      message:"Your message is too short. Try again, please."
    },
    maxlength: {
      value: 140,
      message:"Your message is too long. Try again, please."
    } */
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
    if (error.code === 11000) {
    res.status(400).json( { message: 'Duplicated value', fields: error.keyValue })
  }
  res.status(400).json(error)
  }
})

app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedThought = await Thought.findByIdAndDelete({ id });
    if (deletedThought) {
      res.json(deletedThought);
    } else {
      res.status(404).json({ message: 'Not found' })
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
