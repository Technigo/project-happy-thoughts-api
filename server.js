import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// const Thought = mongoose.model('Thought', {
//   text: {
//     type: String,
//     required: true,
//     minlength: 5,
//   },
//   like: {
//     type: Boolean,
//     default: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// })

const Task = mongoose.model('Task', {
  text: {
    type: String,
    required: true,
    minlength: 5
  },
  complete: {
    type: Boolean,
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

app.get('/', (req, res) => {
  res.send('Root, short description here.')
})


app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(tasks)
  res.send('hello')
})

// POST 


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
