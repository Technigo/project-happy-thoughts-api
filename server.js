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
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: false,
    default: "anonymous",
    maxlength: 50
  },
  tag: {
    type: String,
  }
})

//SEEDING FOR ADDING NEW DATA. When do I need to use/do this??
// if (process.env.RESET_DB) {
//   console.log('Resetting database')
//   const seedDatabase = async () => {
//     await Thought.deleteMany({})

//     thought.forEach(() => {
//       new Thought().save()
//     })
//   }
//   seedDatabase()
// }

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// MIDDLEWARES
app.use(cors())
app.use(bodyParser.json())
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailabale' })
  }
})

app.get('/', async (req, res) => {
  const { sort } = req.query
  const sortData = (sort) => {
    if (sort === 'dates') {
      return { createdAt: 'asc' }
    } else if (sort === 'hearts') {
      return { hearts: 'desc' }
    } else {
      return { createdAt: 'desc' }
    }
  }
  let thoughts = await Thought.find().sort(sortData(sort)).limit(20).exec()
  res.json(thoughts)
})


//GET A LIST OF THE THOUGHTS IN THE DATABASE. desc = descending order
app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  const { tag } = req.query
  if (tag) {
    const filteredThoughts = await Thought.find({ tag: tag })
    res.json(filteredThoughts)
  }
  res.json(thoughts)

  // const { sort } = req.query
  // const sortData = (sort) => {
  //   if (sort === 'dates') {
  //     return { createdAt: 'asc' }
  //   } else if (sort === 'hearts') {
  //     return { hearts: 'desc' }
  //   } else {
  //     return { createdAt: 'desc' }
  //   }
  // }
  // let thoughts = await Thought.find().sort(sortData(sort)).limit(20).exec()
  // res.json(thoughts)
})

//POST/SEND INFORMATION IN A REQUEST
app.post('/', async (req, res) => {
  //Retrieve the information sent by the client to our API endpoint
  const { message, name, tag } = req.body
  //use our mongoose model to create the database entry
  const thought = new Thought({ message, name, tag })
  try {
    //Success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
    console.log(savedThought)
  } catch (err) {
    //Bad request
    res.status(400).json({ message: 'Could not save thought to the database', error: err.errors })
  }
})

// app.post("/:thoughtID/like", async (req, res) => {
//   //Find specific thought
//   const thoughtID = req.params.thoughtID
//   const thought = await Thought.findById(thoughtID)

//   if (thought) {
//     //Success case
//     thought.hearts += 1
//     thought.save()
//     res.status(201).json(thought)
//   }
//   else {
//     res.status(404).json({ message: `No thought with id: ${thoughtID} `, error: err.errors })
//   }
// })

//Jennies way of finding thougtId for likes
app.post("/:id/like", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { hearts: 1 } },
      { new: true }
    )
    res.json(thought)
  } catch (err) {
    res
      .status(400)
      .json({ message: "could not update heart", errors: err.errors })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
