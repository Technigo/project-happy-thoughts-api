import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
// import Person from './PersonModel'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Task = mongoose.model('Task', {
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 500
  },
  id: {
    type: Number,
    required: true
  },
  complete: {
    type: Boolean,
    default: false
  },
  createdAt: {
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

// find all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec()
  res.json(tasks)
})

// find not completet
app.get('/tasks/notcomplete', async (req, res) => {
  console.log('Get /taks/notcomplete')

  const notComplete = await Task.find({ complete: false })
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec()
  res.json(notComplete)
})

//post task
app.post('/tasks', async (req, res) => {
  const { text, id, complete } = req.body
  const task = new Task({ text, id, complete })

  try {
    const savedTask = await task.save()
    res.status(200).json(savedTask)
  } catch (err) {
    res
      .status(400)
      .json({ message: 'could not save tasks to database', errors: err.errors })
  }
})

//update task complete
app.post('/tasks/:id/complete', async (req, res) => {
  const { id } = req.params
  console.log(`POST /task/${id}/complete`)
  await Task.updateOne({ id: id }, { complete: true })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
