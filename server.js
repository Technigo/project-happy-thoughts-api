import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thoughts = mongoose.model('Task', {

    message: {
        type: String,
        required: true,
        minLenght: 5,
        maxLenght: 140
    },
    hearts: {
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
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
app.get('/', (req, res) => {
    res.send('Hello world')
})

app.get('/thoughts', async(reg, res) => {
    const thoughts = await Task.find().sort({ createdAt: 'desc' }).limit(20).exec()
    res.json(tasks)
})

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})