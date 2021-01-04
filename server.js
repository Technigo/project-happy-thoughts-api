import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

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
    default: Date.now
  }
})

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20)
  if (thoughts.length > 0)
  {res.json(thoughts)}
  else {res.json({message: "No thoughts found"})}

})

app.post('/thoughts', async (req, res) => {
  try { 
    const {message} = req.body
    const thought = await new Thought({message}).save()
    res.json(thought)
    
  } catch (error) {
    res.status(400).json({message:"Invalid input" , error: error})
  }

})

app.post('/thoughts/:thoughtId/like', async (req,res) => {
  try {
    const thought = await Thought.findOneAndUpdate({_id: req.params.thoughtId}, { $inc: {hearts: 1}}, {new:true, useFindAndModify: false})
    res.json(thought)
  } catch (error) {
    res.status(400).json({message: "Invalid input", error: error})
  }
 })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
