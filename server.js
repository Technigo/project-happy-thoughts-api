import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Person = mongoose.model('Person', {
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlenght: 500
  },
  height: {
    type: Number,
    required: true,
    min: 5
  },
  birthdate: {
    type: Date,
    default: Date.now()
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

app.post('/people', async (req, res) => {
  try {
    const person = await new Person(req.body).save()
    res.status(200).json(person)
  } catch (err) {
    res.status(400).json({ message: 'couldnt save person', errors: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
