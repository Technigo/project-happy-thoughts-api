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

//schema which defines the data which is posted to the backend
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: [
      5,
      "Please type in more words",
    ],
    maxlength: [
      140, 
      "Please stop writing; that are enough words."
    ],
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },

  hearts: {
    type: Number,
    default: 0,
  },

  name: {
    type: String,
    minlength: 3,
    unique: true,
    default: "Anonymous",
  },
})

const Thought = mongoose.model('Thought', ThoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.post('/thoughts', (req, res) => {

})
// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
