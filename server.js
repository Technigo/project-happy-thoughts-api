import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughtsVersion3"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const Thought = mongoose.model('Thought', {
    message:  {
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

//Start defining your routes here


// This endpoint should return a maximum of 20 thoughts, 
// sorted by createdAt to show the most recent thoughts first
app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

//This point expects a json body with the message like {message:"hello"}
//If the thought is valid it should be saved and should include _id 
app.post('/', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({message})
   console.log(thought)
   try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
    } catch (err) {
    res.status(400).json({ message: 'Could not save thought', error: err})
  }
})
 

//Dont require a json body.Given a valid thought id in the url, 
//the API should find that thought, and update its hearts property to add one heart.
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const {thoughtId} = req.params
  const like = await Thought.findById(thoughtId)
  
  if(like) {
    like.hearts += 1
    like.save()
    res.json(like)
  } else {
    res.status(404).json({message: 'Could not find happy thought', error: err.errors})
  }
  })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
