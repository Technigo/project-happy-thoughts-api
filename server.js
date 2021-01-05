import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thought'

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

// ////ROUTES (ENDPOINTS)////

//GET: 20 THOUGHTS IN DESC. ORDER SORTED ON TIMESTAMP
  app.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20)
    res.status(200).json(thoughts)
})

//POST: ADD A THOUGHT
app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  try {
    const newThought = await new Thought({ message }).save()
    res.status(200).json(newThought)
  } catch (err) {
    console.log(err)
    res.status(404).json({
      error: err.errors.message.message
    })
  }
})

//POST: LIKE A THOUGHT 
//(OR PUT? Because I modify something that already exists in the database)
// the heart already has the value of 0, I'm just changing the value so: PUT?
// se lecture @40 mins about PUT/POST regarding likes
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params
  //updateOne or findOneAndUpdate?
  try {
    await Thought.updateOne({ _id: id}, { $inc: { hearts: 1} })
    res.status(200).json(`Thought with id: ${id} got one more like`)
  } catch (err) {
    res.status(404).json({
      message: `Error: could not find a message with id: ${id} to like`,
      error: err.errors
    })
  }
});

//use increment operator: $inc (lecture 18/5 @52 min) look up mongoose docs.

//DELETE A THOUGHT??? --> if I modify my front-end I could implement that there also. 
//Or maybe not because then anyone could delete all messages and that is not desirable.

// START SERVER
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
