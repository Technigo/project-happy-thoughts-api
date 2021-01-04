import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


// post model 
const Message = mongoose.model('post', { 
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  // hearts: {
  //   type: Number,
  //   default: 0 
  // }
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

// post route
app.post('/thoughts', async (req, res) => {
  // send a request body in order to pass information into the API
  // if a lot of values (which I'll have) create const
  // const { message, heart } = req.body
  // handling error by try {}

    // Van shortens this around 13 min into the video
  try {
    // success case
    const message = new Message ({message: req.body.message})
    const savedMessage = await message.save()
    res.json(savedMessage)
  } catch (err) {
    res.json({message: "could not save message", errors: err.errors})
  }
  // res.json(message)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
