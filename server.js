import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
    text: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 140,
    },
    heart: {
      type: Number,
      default: () => 0
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
});


//   Defines the port the app will run on 
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello Claudia')
})

// endpoint returning 20 thoughts in descending order from created date.
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts);
});

app.post('/thoughts', async (req, res) => {
  //Retrive the information sent by the client to our API endpoint 
  const {text, complete} = req.body;

  // Use our mongoose model to create the database entry.
  const thought = new Thought({text, complete});

  try{

  }catch (err){

  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
