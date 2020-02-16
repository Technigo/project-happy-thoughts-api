import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const Thought = mongoose.model('Thought', {
  message: String,
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

// const Person = mongoose.model('Person', {
//   name: {
//     type: String,
//     required: true,
//     minlength: 2,
//     maxlength: 500
//   },
//   height: {
//     type: Number,
//     required: true,
//     min: 5
//   },
//   birthdate: {
//     type: Date,
//     default: Date.now
//   }
// })

// const Task = mongoose.model('Task', {
//   text: {
//     type: String,
//     required: true,
//     minlength: 5
//   },
//   complete: {
//     type: Boolean,
//     default: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// })


// new Person({ name: "linda", height: 150 }).save()


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
  res.send('HAPPY THOUGHTS')
})

app.post('/thoughts', async (req, res) => {
  const thought = new Thought({ text: req.body.text })
  await thought.save()
  res.json(thought)
})

app.post('/people', async (req, res) => {
  //Promises
  new Person(req.body).save()
    .then((person) => {
      res.status(200).json(person)
    })
    .catch((err) => {
      res.status(400).json({ message: 'Could not save person', error: err.errors })
    })

  //Try catch form
  // try {
  //   //Success
  //   const person = await new Person(req.body).save()
  //   res.status(200).json(person)
  // } catch (err) {
  //   //Bad request
  //   res.status(400).json({ message: 'Could not save person', error: err.errors })
  // }
})

//GET A LIST OF THE TASK IN THE DATABASE_ desc = descending order
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(tasks)
})

//POST/SEND INFORMATION IN A REQUEST
app.post('/tasks', async (req, res) => {
  //Retrieve the information sent by the client to our API endpoint
  const { text, complete } = req.body

  //use our mongoose model to create the database entry
  const task = new Task({ text, complete })
  try {
    //Success
    const savedTask = await task.save()
    res.status(201).json(savedTask)
    console.log(savedTask)
  } catch (err) {
    //Bad request
    res.status(400).json({ message: 'Could not save task to the database', error: err.errors })
  }
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})



app.get('/', async (req, res) => {
  const { sort } = req.query
  const sortData = (sort) => {
    if (sort === 'dates') {
      return { createdAt: 'asc' }
    } else if (sort === 'hearts') {
      return { hearts: 'desc' }
    } else if (sort === 'tag') {
      return { tag: 'desc' }
    } else {
      return { createdAt: 'desc' }
    }
  }
  let thoughts = await Thought.find().sort(sortData(sort)).limit(20).exec()
  res.json(thoughts)
})


//GET A LIST OF THE THOUGHTS IN THE DATABASE. desc = descending order
app.get('/', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: 'desc' })
    .limit(20).exec()
  const { tag } = req.query
  if (tag) {
    const filteredThoughts = await Thought.find({ tag: tag })
    res.json(filteredThoughts)
  }
  res.json(thoughts)
})