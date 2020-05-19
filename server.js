import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Tought = mongoose.model('Tought', {
  text: {
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

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Get the 20 most recent toughts
app.get('/toughts', async (req, res) => {
  const toughts = await Tought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(toughts)
})

app.post('/toughts', async (req, res) => {
  // retrieve the information sent from the client to out API endpoint
  const { text, complete } = req.body
  // use our mongoose model to create the database entry
  const tought = new Tought({ text, complete })
  try {
    // sucess
    const savedTought = await tought.save()
    res.status(201).json(savedTought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save tought to the Database', error: err.errors })

  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
