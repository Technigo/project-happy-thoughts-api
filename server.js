import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { Thought } from './model'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

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

app.get('/thoughts', async (req, res)=>{
  const thoughts = await Thought.find().sort({createdAt:'desc'}).limit(20).exec();
  res.json(thoughts)
})

app.post('/thoughts', async (req, res)=>{
  const {message} = req.body
  const thought = new Thought({message})
  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  }
  catch(err){
    res.status(400).json({message:"could not save thought", error: err.errors})
  }
})
app.post('/thoughts/:thoughtId/like', async(req, res)=>{
  const {thoughtId} = req.params
  Thought.findByIdAndUpdate(thoughtId, {$inc:{hearts: 1}},{new:true},(err, doc)=>{
    if(doc){
      res.json(doc)
    }
    else {
      res.status(400).json({message:"could not like this post", error: err})
    }
  }) 
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
