import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thoughts'

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
// app.get('/', (req, res) => {
//   res.send('Hello world')
// })


app.get('/', async (req, res) => {
  const thoughts = await Thought.find().limit(20)

  if (thoughts.length > 0) {
    res.json(thoughts)
  } else {
    res.status(404).json({ error: "No thoughts found" })
  }

})



/// Add delete 



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
