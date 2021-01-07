import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thoughts = mongoose.model('Thoughts', {
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

  },
  username:{
    type: String,
    minlength: 1

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
  res.send('Welcome to Happy Thoughts API  :)  // See this API live here: ');

})
//GET /thoughts : Endpoint that returns maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.
app.get('/thoughts', async (req, res) => {

  try{
    const thoughts = await Thoughts.find()
    .sort({createdAt:'desc'})
    .limit(20)
    .exec()
    
    res.json(thoughts)
  }
  catch (err) {
    res.status(400).json({ message:"Error when trying to get thoughts", error: err.errors })
  }
})

// POST /thoughts : Endpoint to add a new Thought to the database
app.post('/thoughts', async (req, res) => {
   // Retrieve message and username sent by the client in the POST request body
  const {message} = req.body
    // use mongoose model to create a new Thought using the message we got from the client
  const thought = new Thoughts({message})
  try {
     // Success case: Add a new instance of Thought to the database by calling save() on it
    const newThought = await thought.save()
    res.status(200).json(newThought)
  }
  catch(err) {
    res.status(400).json({ message:"Error when trying to save thought", error: err.errors })
  }
})

// POST /thoughts/:thoughtId/like : Endpoint to add a like to a specific thought
app.post('thoughts/:thoughtId/like', async (req, res) =>{
  const thoughtId = req.params.thoughtId;
  try{
    const addLike = await Thoughts.updateOne({ _id: thoughtId}, { $inc: { hearts: 1 } })
    res.json(addLike)
  }
  catch(err){
    res.status(400).json({message: "Error when adding a like", error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
