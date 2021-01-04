import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thought'

// DEFAULT SETUP
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/hanna-happyThoughts" // The name of the database when using Mongo DB Compass.
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// MIDDLEWARES (to enable cors and json body parsing)
app.use(cors())
app.use(bodyParser.json())

// RESET DATABASE
//Note to self: in Heroku make sure to set config vars: RESET_DATABASE = true
if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Thought.deleteMany()
  }
  seedDatabase()
}

// ROUTES (ENDPOINTS)
// app.get('/', (req, res) => {
//   res.send('Hello world')
// })

//GET: 20 THOUGHTS IN DESC. ORDER SORTED ON TIMESTAMP
  app.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20)
    res.status(200).json(thoughts)
})

//POST: ADD A THOUGHT Q: How do I display a clearer error-message to the user? Do I even have to do that in this case?
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()
    res.status(200).json(newThought)
  } catch (error) {
    console.log(error)
    res.status(400).json({error})
  }
})

//POST: LIKE A THOUGHT
//path: /thoughts/${id}/like

//DELETE A THOUGHT??? --> if I modify my front-end I could implement that there also

// START SERVER
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
