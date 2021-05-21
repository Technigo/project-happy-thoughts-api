import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
//import dotenv from 'dotenv'

//dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
// copy this url and paste in mongo compass as connection string. The end of the url is the name of our database "happyThoughts" in this case
// will have connection when we save the first item
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start

const thoughtSchema = new mongoose.Schema({
  //three fields for each schema
  message: {
    type: String,
    required: [true, "Message is required"], 
    trim: true,
    minlength: 5,
    maxlength: 140,
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

const Thought = mongoose.model('Thought', thoughtSchema)

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//create post request (can have get request with same name but not problem for mongoose/express when its different methods)

// Thoughts array
app.get('/thoughts', async (req, res) => {
  try {
    const allThoughts = await Thought.find().sort({ createdAt: -1 }).limit(20)
    res.json(allThoughts)
  } catch (error) {
    res.status(400).json(error)
  }
})

//Post happy thought
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({ message: req.body.message }).save() //kolla at det ej går o skicka hjärtan från början
    res.json(newThought)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/thoughts/:id/likes', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findByIdAndUpdate( { _id: id }, { $inc: { hearts: 1 }})
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
      res.status(400).json({ message: 'invalid request', error })
  }
})

app.delete('/thoughts/:id', async(req, res) => {
  const { id } = req.params

  try {
    const deletedThought = await Thought.findByIdAndDelete(id)
    if(deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'invalid request', error })
  }
})

app.patch('/thoughts/:id', async(req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findByIdAndUpdate(id, { message: req.body.message }, { new: true } )
    
    if (updatedThought) {
      res.json(updatedThought) 
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) { 
    res.status(400).json({ message: 'invalid request', error })
  }
})

app.put('/thoughts/:id', async(req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findOneAndReplace({ _id: id }, req.body, { new: true } ) 
    
    if (updatedThought) {
      res.json(updatedThought) 
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'invalid request', error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})