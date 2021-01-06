import express from 'express'
import bodyParser from 'body-parser'
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

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


// Build a model with properties message, heart and createdAt
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

// Endpoint to GET and list the 20 latest thoughts
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(thoughts) //sends thoughts back in the form of json
})

// Endpoint to POST a thought to the database
app.post('/thoughts', async (req, res) => {

  try {
    // Success 
    const thought = await new Thought(req.body).save();
    res.status(200).json(thought);

  } catch (err) {
    res.status(400).json({
      message: 'Could not save thought to database',
      error: err.errors
    })
  }
})

// Endpoint to POST likes to a choosen thought
app.post('/thoughts/:thoughtId/like', async (req, res) => {

  try {
    await Thought.updateOne({ _id: req.params.thoughtId }, { $inc: { hearts: 1 } });
    res.status(200).json();

  } catch (err) {
    res.status(400).json({
      message: 'Could not save like, thought not found',
      error: err.errors
    })
  }

})



// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world, welcome to my happy thoughts API // Anna Hellqvist')
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
