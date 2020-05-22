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
  maxlength: 140, 
  },
  heart: { 
  type: Number, 
  default: 0 
  },
  createdAt: { 
  type: Date, 
  default: () => new Date()
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

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

app.post('/thoughts', async (req, res) => {
  // Retrieve the information send by the client to your API endpoint
  const { message} = req.body

  // Use our mongoose model to create the database entry
  const thought = new Thought({message});

  try {
    // Success
    const saveThought = await thought.save()
    res.status(201).json(saveThought)
    } catch (err) {
      res.status(400).json({ message: 'could not save this thought to the Database', error:err.errors})
    }
})


app.post('/thoughts/:id/like', async (req, res)=> {
  const { id } = req.params
  const errMessage = 'could not found ${id}'
  
  try {
  
  const updateThought = await Thought.updateOne({ '_id': id },
     {'$inc':{ 'heart':1  }})
     res.status(201).json(updateThought)
    } catch (err) {
      res.status(404).json({ message: errMessage })
     }
    }) 

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
