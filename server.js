/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
// eslint-disable-next-line max-len
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

// Date.now without ()
// if () it is going to be set in the moment we run our app and not going to change
// Schema is only run one time when application starts
// enum always has to be array
// match takes only regex
const thougthSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Empty message not allowed'],
    unique: true,
    trim: true,
    // enum: ['Technigo is cool', 'Technigo is great', 'Best bootcamp every']
    // match: /^[^0-9]+$/,
    validate: {
      validator: (value) => {
        return /^[^0-9]+$/.test(value)
      },
      message: 'Numbers are not allowed'
    },
    minlength: [5, 'Message must be longer than 5 characters'],
    maxlength: [140, 'Message must be shorter than 140 characters']
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

const Thought = mongoose.model('Thought', thougthSchema)

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

// POST request for new thought
app.post('/thoughts', async (req, res) => {
  // const { message } = req.body
  // console.log(req.body)
  // Specify all of the objects in schema
  try {
    const newThought = await new Thought(req.body).save()
    res.json(newThought)
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Duplicated value', fields: error.keyValue })
    }
    res.status(400).json(error)
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
