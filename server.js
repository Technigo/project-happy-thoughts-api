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


// Routes

// To return the latest 20 thoughts
app.get('/thoughts', async (request, response) => { 
  try {
    const thoughts = await Thought.find()
    .sort({createdAt: 'desc'})
    .limit(20)
    .exec()
    response.status(201).json(thoughts)
  } catch (err) {
    response.status(400).json({message: 'Sorry, could not load thoughts' })
  }
})

// To create a new thought
app.post('/thoughts', async (request, response) => { 
    try {
      const thought = new Thought({message: request.body.message})
    await thought.save()  
    response.status(201).json(thought)
    }
    catch (err) {
      response.status(400).json({message: "Sorry, could not save thought to the database", error: err.errors})
    }
  })
  /*  try {
    const {message, hearts} = request.body 
    const thought = new Thoughts({message: message, hearts: hearts})

    const newThought = await thought.save()
    response.status(201).json(newThought)
  } catch (err) {
    response.status(400).json({message: "Sorry, could not save thought to the database", error: err.errors})
  } */



// To add a like to a specific thought
app.post('/thoughts/:thoughtId/like', async (request, response) => {
  const {thoughtId} = request.params
  try {
    await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } });
    response.status(200).json(thoughtId)
  } catch (err) {
      response.status(404).json({message: "Sorry, could not add a like to this thought", 
      error: err.errors})
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
}) 
