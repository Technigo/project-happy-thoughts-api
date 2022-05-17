import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/project-happy-thoughts-api'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

const ThoughtCollection = new mongoose.Collection({
  message: {
    type: String,
    required: [true, 'A message is required.'],
    minLength: [5, 'The message must be at least 5 characters.'],
    maxLength: [140, 'The message can have a maximum of 140 characters.'],
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    typ: Date,
    default: () => new Date(),
  },
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello Technigo!')
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
