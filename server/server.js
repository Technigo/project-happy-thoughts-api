import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

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

const Thought = new mongoose.model('Thought', {
  message: String, //req, min 5 max 40
  lettersInContent: Number,
  isValid: Boolean,
  likes: Number, //default: 0. Not assignable when creating a new thought. 
  createdAt: new Date(), //time the thought was added to the database - defaults current time, not assignable when creating thought
});

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', (req, res) => {
  //return maximum 20 thoughts, sorted by createdAt to show the most recent thoughts first
})

app.post('/thoughts', (req, res) => {
  //expects a JSON body with the thought message { "message": "Express is great!"} If valid, save and include saved thought object 
})

app.post('/thoughts:thoughtsID/like', (req, res) => {
  //Doesn't require JSON body. Given a valid thought id in the URL, the API should find that thougt and update its hearts proprerty to add one heart
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
