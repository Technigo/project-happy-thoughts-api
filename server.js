import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thought'

// DEFAULT SETUP
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts" // The name of the database when using Mongo DB Compass.
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
app.get('/', async (req, res) => {
 const thoughts
})

//POST: ADD A THOUGHT 


//POST: LIKE A THOUGHT



// START SERVER
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
