import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Please enter a message."],
    trim: true,
    minlength: [5, 'Oops your message needs to be longer than 5 characters'],
    maxlength: [140, 'Oops, message is too long! Max length is 140 characters']
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    default: 'Anonymous',
  }
})

const Thought = mongoose.model('Thought', thoughtSchema)

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// GET Endpoint to return 20 thoughts, sorted by createdAt to show the most recent thoughts first.
app.get('/thoughts', async (req, res) => {
  try {
    const allThoughts = await Thought.find()
      .sort({ createdAt: 'descending' })
      .limit(20)
    res.status(200).json(allThoughts)
  } catch (error) {
    res
      .status(400)
      .json(error)
  }
})
// POST a new thought
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({
      message: req.body.message,
      author: req.body.author
    }).save()
    res.status(200).json(newThought)  
  } catch (error) {
    if (error.code === 11000) {
    res.status(400).json({ message: 'Duplicated value', fields: error.keyValue })
    }
    res.status(400).json(error)
  }
})

// POST - update like/heart property on on thought object
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id, 
      { $inc: {
          hearts: 1 
        }
      },
      {
        new: true
      },
    ) 
    if (updatedThought) {
      res.status(200).json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found'})
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Delete thought by id
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {                          
    const deletedThought = await Thought.findByIdAndDelete(id) 
    if (deletedThought) {
      res.status(200).json(deletedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    } 
  } catch (error) { 
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// PUT ----> do this --> CHANGE to PUT + change in FRONTEND as well. POST is very generic!
// PUT - update thought object by id 
app.put('/thoughts/:id', async (req, res) => {
  const {id} = req.params

  try {                                                  
    const updatedThought = await Thought.findOneAndReplace({ _id: id }, req.body, { new: true })
    if (updatedThought) {
      res.status(200).json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found'})
    }
  } catch(error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
