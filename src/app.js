import express from 'express'
import ThoughtService from '../lib/thought'

import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

/* Middlewares only required for production - not test */
app.use(cors())
app.use(bodyParser.json())

app.get('/', async (req, res, next) => {
  try {
    const thoughts = await ThoughtService.listThoughts(20) // TODO limit 20 newest
    res.json(thoughts)
  } catch (err) {
    next(err)
  }
})

app.post('/', async (req, res, next) => {
  const message = req.body.message
  try {
    const thought = await ThoughtService.createThought(message)
    res.json(thought)
  } catch (err) {
    next(err)
  }
})

app.post('/:id/like', async (req, res, next) => {
  const id = req.params.id
  try {
    const thought = await ThoughtService.updateLikes(id)
    res.json(thought)
  } catch (err) {
    next(err)
  }
})

app.use((req, res, next) => {
  res.status(404).json({ error: `route ${req.originalUrl} doesn't exist` })
})

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message })
})

module.exports = app
