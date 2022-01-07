/* eslint-disable max-len */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true, 
  useFindAndModify: false
})
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// check via middleware, if we are connected to the database
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  // No. of hearts should not be assignable when creating a new thought.
  hearts: {
    type: Number,
    default: 0
    
  },
  // Date should not be assignable when creating a new thought.
  createdAt: {
    type: Date,
    default: Date.now
  },
  // possibility to add the author's name to the thought
  author: {
    type: String,
    maxlength: 50
  },
  // possibility to add a category to the thought
  category: {
    type: String,
    enum: ['Food', 'Home', 'Animals', 'Project', 'Just Happy', '']
  }
})

const Thought = mongoose.model('Thought', thoughtSchema)

// Start defining your routes here
app.get('/', (req, res) => {
  res.json({
    Welcome: 'Welcome to the happy thoughts API',
    Documentation: 'https://documenter.getpostman.com/view/18068162/UVXdNe6K'
  })
})

// route provides all endpoints
app.get('/endpoints', (req, res) => {
  res.json({
    response: listEndpoints(app),
    success: true
  })
})

// Endpoint returns a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20)
  res.status(200).json(thoughts)
})

// endpoint expects a JSON body with the thought message
app.post('/thoughts', async (req, res) => {
  const { message, author, category } = req.body

  try {
    // success
    const newThought = await new Thought({ message, author, category }).save()
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    // Bad request
    res.status(400).json({ response: error, success: false });
  }
})

// endpoint to increase hearts/likes
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const updatedLike = await Thought.findByIdAndUpdate(
      // Argument 1 - id
      thoughtId,
      // Argument 2 - properties to change 
      {
        $inc: {
          hearts: 1
        }
      },
      // Argument 3 - options (not mandatory). {new: true} is needed to send an updated value from the DB to the frontend
      {
        new: true
      }
    )

    if (!updatedLike) {
      res.status(404).json({ response: ' No thought found with this ID', success: false })
    } else {
      res.status(200).json({ response: updatedLike, success: true });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
