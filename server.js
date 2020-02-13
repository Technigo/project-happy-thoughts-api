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
  heart: {
    type: Number,
    // default: 0, - Testa först utan för att se vad som händer! Men det ska vara 0
    // Should not be assignable when creating a new thought. For example, if I send a POST request to / to create a new thought with this JSON body; { "message": "Hello", "hearts": 9000 }, then the hearts property should be ignored, and the object we store in mongo should have 0 hearts.
  },
  createdAt: {
    type: Date,
    // default: () => Date.now()
    default: () => new Date
    // Should not be assignable when creating a new thought.
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
  const thoughts = req.p
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
