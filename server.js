import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const ERR_NO_THOUGHTS = 'Sorry, could not find any thoughts.'

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()


// Thought model 

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Get 20 of the latest thoughts in descending order starting from the last posted one.

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  if(thoughts){
  res.json(thoughts)
  } else {
    res.status(404).json({message: ERR_NO_THOUGHTS})
  }
})

// Post your own thought

app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({message})
  try {
    const savedThought = await thought.save()
    res.json(201).json(savedThought)
  } catch (error) {
      res.status(400).json({message: 'Sorry could not save this thought to the database', error: error.errors});
      }
  } 
)

// POST /:thoughtId/like - add a like

app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params
  console.log(`POST /thoughts/${id}/like`)
  try {
    await Thought.updateOne({ _id: id }, { $inc: { hearts: 1 } })
    res.status(201).json()
  } catch {
    res.status(404).json({message: 'Could not update likes to an undefined thougt.'})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
