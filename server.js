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
    hearts: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: () => new Date 
    },
})


//   Defines the port the app will run on 
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello Teachers')
})

// GET endpoint returning 20 thoughts in descending order from created date.
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

//  POST to database 
app.post('/thoughts', async (req, res) => {
  //Retrive the information sent by the client to our API endpoint 
  try {
    const thought = await new Thought ({ message: req.body.message }).save()
    res.status(200).json(thought)
  } catch (error) {
    res.status(400).json({ message: "Your message is too long/ short", errors:error.errors  })
  }
})



// POST hearts (for likes)
app.post('/thoughts/:thoughtId/heart', async (req, res) => {
  const { thoughtId } = req.params
  try {
    await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } })
    //confirmation message / or just like.. ?
  } catch (error) {
    res.status(404).json({
      message: "Nothing to like", error: error.errors
    })
  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
