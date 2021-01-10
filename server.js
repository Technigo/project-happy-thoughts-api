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

// Mongoose model for Thought with properties message, hearts & createdAt
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 140
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

// Routes 
app.get('/', (req, res) => {
  res.send('Hello! Welcome to my Happy Thoughts API 💌')
})

// Endpoint to GET the 20 most recent thoughts, ordered by createdAt in descending order


// Endpoint to POST a new thought to the database


// Endpoint to POST likes on a certain thought, validated by id


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
