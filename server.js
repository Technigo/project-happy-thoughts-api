import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

//Writing the schema separately, to be able to not repeat it. It can be combined like this
const ThoughtSchema = new mongoose.Schema({      
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
    //enum: ['Example', 'example'] //limitation of values
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now 
  }
})

const Thought = mongoose.model('Thought', ThoughtSchema)


// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello happy world! To see the API live, go to: https://project-happy-thoughts-jessica-nordahl.netlify.app/')
})

//how we handle the body from frontend/request
app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const newThought = await new Thought ({ message }).save() //asynchronous code with await
    res.status(201).json({ response: newThought, success: true }) //status created
  } catch (error) {
    res.status(400).json({ response: error, success: false }) 
  }
})

// Endpoint to increase the hearts/likes per thought
app.post('/thoughts/:thoughtsId/like', async (req, res)=> {
  //we find the member by id
  const { thoughtsId } = req.params

  try {
  const updatedLike = await Thought.findByIdAndUpdate(
    thoughtsId, 
    { $inc: 
      { like: 1 //this makes the score update with 1 like, at every update 
      },
    },
  { new: true }
  )
if (updatedLike) {
  res.status(201).json({ response: success, success: true })
} else {
  res.status(404).json({ response: error, success: false });
}
} catch (error){ 
    res.status(400).json({ 
      response: error, 
      message: "Couldn't update like", 
      success: false });
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
