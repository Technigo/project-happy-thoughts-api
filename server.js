import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { restart } from 'nodemon'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Setup model
const Thought = mongoose.model('Thought', {

    message: {
        type: String,
        required: true,
        minlenght: 5,
        maxlenght: 140
    },
    hearts: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tag: {
        type: String
    }

})

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
app.get('/', async(req, res) => {
    const thoughts = await Thought.find().limit(20).sort({ createdAt: 'desc' })
    res.json(thoughts)
})

app.post('/', async(req, res) => {
    const thought = new Thought({
        message: req.body.message,
        hearts: 0
    })
    try {
        const saved = await thought.save()
        res.status(201).json(saved)
    } catch (err) {
        res.status(400).json({ message: 'could not save thought', errors: err.errors })
    }
})

app.post('/:id/like', async(req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.id }, { $inc: { hearts: 1 } })
        res.status(200).json(thought)
    } catch (err) {
        res.status(400).json({ message: 'could not update heart' })

    }
})



// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})