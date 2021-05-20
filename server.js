import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

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


app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//Endpoint to fetch a thoughts list
app.get('/thoughts', async (req, res) => {
  try {
    const allThoughts = await Thought.find().sort({createdAt: -1 }).limit(20)//.skip(20).limit(20) if you want to show another 20
    res.json(allThoughts)
  } catch (error) {
    res.status(400).json({ message: 'Something went wrong', error })
  }
})

//Endpoint to create a new Thought
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()// same as ({ message: req.body.message })
    res.json(newThought)
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Duplicated value', fields: error.keyValue })
    } 
    res.status(400).json(error)
  }
})

//An endpoint to delete a single Thought
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedThought = await Thought.findByIdAndDelete(id)
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }

  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

//An enpoint to update likes
app.post('/thoughts/:id/likes', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { 
        $inc: { //$inc is a special mongoose query selector used to update a number value
          hearts: 1 
        } 
      },
      { 
        new: true
      } ) //{ new: true } is responsible for sending back an object with already updated values
    res.json(updatedThought)
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
