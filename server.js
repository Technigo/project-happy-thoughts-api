import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import Thought from './models/thought'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8090
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Happy Thoughts!')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

app.post('/thoughts', async (req, res) => {
  try{
    const newThought = await new Thought({ message: req.body.message }).save()
    res.status(200).json(newThought)
  }catch (error){
    console.log(error)
    res.status(400).json({success: false, error: error.errors})
  }
})
//need to create a delete button in frontend
app.delete('/thoughts/:id', async (req, res) => {
  try{
    await Thought.deleteOne({ _id: req.params.id })
    res.status(200).json({ success: true })
  }catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message })
  }
})

app.put('/thoughts/:id', async (req, res) => {
  try{
    const updatedThought = await Thought.updateOne(
      { _id: req.params.id },
      { $inc: { hearts: 1 } }
    )
    res.status(200).json({ success: true })
  }catch (error){
    res.status(400).json({ success: false, message: error.message })
  } 
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
