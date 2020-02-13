import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  like: {
    type: Number,
    default: false
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
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(140).exec()
  res.json(thoughts)
})

app.post('/thoughts', async (req, res) => {
  //Retrieve the information sent by the client to our API endpoint
  const {text, like} = req.body.message

  // Use our mongoose model to create the database entry
  const thought = new Thought({text, like})

  try {
    // Success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  }catch (err) {
    res.status(400).json({message: 'Could not save message to the Database', error: err.errors}) 
  }
})

 // The endpoint updates the number of like
app.post('/:id/like', async (req, res) => {
  
  try {
    const like = await Thought.findOneAndUpdate(
      { "_id": req.params.id }, //filter
      { $inc: { "heart": 1 } },//update
      { returnNewDocument: true } //doesn't update/work 
    )
    res.status(201).json(like)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Ups, I could not save your like', error: err })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
