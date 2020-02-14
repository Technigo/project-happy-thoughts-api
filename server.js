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
    maxlength: 140,
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
  res.send('Hello happy thoughts')
})

app.get('/thoughts', async (req, res) => {

  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts)
})

app.post('/thoughts', async (req, res) => {
    // Get data sent by user to api
    const {message} = req.body
    // through mongoose model
    const thought = new Thought({message})
  try {
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err){
    res.status(400).json({message: 'Could not post your thought', error:err})
  }
})

app.post('/thoughts/:_id/like', async(req, res) => {
  const {_id} = req.params;
  try {
    await Thought.updateOne({'_id': _id}, {'$inc': {'heart': 1}});
    // If not json is in the response, you have to invoke a send function
    res.status(201).send();
  } catch (err) {
    res.status(401).json({message: 'Like not sent', error:err})
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
