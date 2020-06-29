import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()
const listEndpoints = require('express-list-endpoints')

app.use(cors())
app.use(bodyParser.json())


const thoughts = mongoose.model('thoughts', { 
  message: {
        type: String,
        required: true,
        minlenght: [2, "At least 2 characters"],
        maxlength: [40, "Maximum length, 140 characters"]
    },
  hearts: {
       type: Number,
       default: 0
   },
   createdAt:{
        type: Date,
        default: Date.now
    }
  })
//Start defining your routes here
  app.get('/', (req, res) => {
    res.send(listEndpoints(app))
  })

//Getting the endpoints
  app.get("/thoughts", async (req, res) => {
    
    const { page } = req.query  
    const resPerPage = 20
    const pageNumber = +page || 1
    const skip = perPage * (pageNumber - 1)

    const allThoughts = await Thought.find() 
    const pages = Math.ceil(allThoughts.length/perPage)
   
    const thougths = await thought.find()
      .sort({ createdAt: "desc" })
      .limit(resPerPage)
      .skip(skip)
   })
  //Posting the thoughts
  app.post("/thoughts", async (req, res) => {
    const { message } = req.body
    const thought = new Thought({ message })
    try {
      const saveThought = await thought.save()
      res.status(201).json(saveThought)
    } catch (err) {
      res.status(400).json({ errors: err.errors, message: "Unable to add new thought" })
    }
  })
  
  app.post("/:thoughtId/like", async (req, res) => {
    const { thoughtId } = req.params
  
    try {
    await Thought.updateOne({ _id: thoughtId }, { $inc: {hearts: 1} })
      res.status(201).json(like)
    } catch (err) {
      res.status(400).json({message: "unable to add like, no thought available", error: err.errors})
    }
  })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
