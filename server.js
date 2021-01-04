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

const Thoughts = mongoose.model("Thoughts", {
  message: {
    type: String,
    required: true,
    minLength: 5,
    maxLenght: 140
  },
  heart: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

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
  
  try {
    const thoughts = await Thoughts.find().sort({createdAt: 'desc'}).limit(20).exec();
    res.status(201).json(thoughts);
  } catch (err) {
    res.status(400).json({message: "could not load the database" })
  }
  
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
